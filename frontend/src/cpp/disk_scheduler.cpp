#include <emscripten/bind.h>
#include <emscripten/val.h>

#include <algorithm>
#include <cmath>
#include <string>
#include <vector>

using emscripten::val;
using std::string;

namespace {

struct Request {
  string id;
  int cylinder;
  string priority;
};

struct Step {
  int number;
  string requestId;
  int cylinder;
  string direction;
  double seekDistance;
  double cumulativeMovement;
  double waitTime;
  string priority;
  bool hasPriority = false;
  bool throttled = false;
  bool boundaryReversal = false;
  bool includeThrottleField = false;
};

struct Detail {
  string id;
  int cylinder;
  string priority;
  int serviceOrderIndex;
  double waitTime;
  double seekDistance;
  string status;
};

struct Result {
  string algorithmName;
  std::vector<string> serviceOrder;
  std::vector<Step> trace;
  std::vector<Detail> requestDetails;
  double totalHeadMovement = 0;
  double averageWaitTime = 0;
  double maxWaitTime = 0;
  string maxWaitRequestId = "N/A";
  double averageSeekDistance = 0;
  int directionChanges = 0;
  int throttlingEvents = 0;
  int prioritySatisfactionScore = 100;
  int starvationRiskScore = 0;
  int starvedRequestsCount = 0;
};

int priorityScore(const string& priority) {
  if (priority == "HIGH") return 3;
  if (priority == "MEDIUM") return 2;
  return 1;
}

double roundedToTenth(double value) {
  return std::floor(value * 10 + 0.5) / 10;
}

val stepToValue(const Step& step) {
  val value = val::object();
  value.set("stepNumber", step.number);
  value.set("requestId", step.requestId);
  value.set("cylinder", step.cylinder);
  value.set("direction", step.direction);
  value.set("seekDistance", step.seekDistance);
  value.set("cumulativeHeadMovement", step.cumulativeMovement);
  value.set("waitTime", step.waitTime);
  if (step.hasPriority) value.set("priority", step.priority);
  if (step.includeThrottleField) {
    value.set("isThrottled", step.throttled);
  }
  if (step.boundaryReversal) value.set("isBoundaryReversal", true);
  return value;
}

val resultToValue(const Result& result) {
  val value = val::object();
  val order = val::array();
  val trace = val::array();
  val details = val::array();

  for (unsigned i = 0; i < result.serviceOrder.size(); ++i) {
    order.set(i, result.serviceOrder[i]);
  }
  for (unsigned i = 0; i < result.trace.size(); ++i) {
    trace.set(i, stepToValue(result.trace[i]));
  }
  for (unsigned i = 0; i < result.requestDetails.size(); ++i) {
    const auto& detail = result.requestDetails[i];
    val item = val::object();
    item.set("id", detail.id);
    item.set("cylinder", detail.cylinder);
    item.set("priority", detail.priority);
    item.set("serviceOrderIndex", detail.serviceOrderIndex);
    item.set("waitTime", detail.waitTime);
    item.set("seekDistance", detail.seekDistance);
    item.set("status", detail.status);
    details.set(i, item);
  }

  value.set("algorithmName", result.algorithmName);
  value.set("serviceOrder", order);
  value.set("trace", trace);
  value.set("totalHeadMovement", result.totalHeadMovement);
  value.set("averageWaitTime", result.averageWaitTime);
  value.set("maxWaitTime", result.maxWaitTime);
  value.set("maxWaitRequestId", result.maxWaitRequestId);
  value.set("averageSeekDistance", result.averageSeekDistance);
  value.set("directionChanges", result.directionChanges);
  value.set("throttlingEvents", result.throttlingEvents);
  value.set("prioritySatisfactionScore", result.prioritySatisfactionScore);
  value.set("starvationRiskScore", result.starvationRiskScore);
  value.set("starvedRequestsCount", result.starvedRequestsCount);
  value.set("requestDetails", details);
  return value;
}

std::vector<Request> readRequests(const val& input) {
  const unsigned count = input["length"].as<unsigned>();
  std::vector<Request> requests;
  requests.reserve(count);
  for (unsigned i = 0; i < count; ++i) {
    const val item = input[i];
    requests.push_back({
      item["id"].as<string>(),
      item["cylinder"].as<int>(),
      item["priority"].as<string>()
    });
  }
  return requests;
}

Result makeEmptyResult(const string& name, int initialHead,
                       const string& direction) {
  Result result;
  result.algorithmName = name;
  result.maxWaitRequestId = "None";
  result.trace.push_back({0, "START", initialHead, direction, 0, 0, 0});
  return result;
}

void appendService(Result& result, const Request& request, int& currentHead,
                   const string& direction, int& stepNumber,
                   bool throttled = false, bool includeThrottleField = false) {
  const double seek = std::abs(request.cylinder - currentHead);
  result.totalHeadMovement += seek;
  currentHead = request.cylinder;
  result.trace.push_back({
    stepNumber++, request.id, request.cylinder, direction, seek,
    result.totalHeadMovement, result.totalHeadMovement, request.priority, true,
    throttled
  });
  result.trace.back().includeThrottleField = includeThrottleField;
  result.serviceOrder.push_back(request.id);
  result.requestDetails.push_back({
    request.id, request.cylinder, request.priority,
    static_cast<int>(result.serviceOrder.size()), result.totalHeadMovement, seek,
    throttled ? "THROTTLED" : "SERVICED"
  });
}

void appendBoundary(Result& result, int boundary, int& currentHead,
                    const string& direction, int& stepNumber) {
  const double seek = std::abs(boundary - currentHead);
  result.totalHeadMovement += seek;
  currentHead = boundary;
  result.trace.push_back({
    stepNumber++, "BOUNDARY", boundary, direction, seek,
    result.totalHeadMovement, result.totalHeadMovement, "", false, false, true
  });
}

void calculateMetrics(Result& result, const std::vector<Request>& requests,
                      bool priorityAware) {
  if (result.requestDetails.empty()) return;

  double waitSum = 0;
  double seekSum = 0;
  int highCount = 0;
  int satisfiedHigh = 0;
  for (const auto& detail : result.requestDetails) {
    waitSum += detail.waitTime;
    seekSum += detail.seekDistance;
    if (detail.waitTime >= result.maxWaitTime) {
      result.maxWaitTime = detail.waitTime;
      result.maxWaitRequestId = detail.id;
    }
    if (detail.priority == "HIGH") {
      ++highCount;
      const int cutoff = priorityAware
        ? static_cast<int>(std::ceil(requests.size() * 0.6))
        : static_cast<int>(std::ceil(requests.size() / 2.0));
      if (detail.serviceOrderIndex <= cutoff) ++satisfiedHigh;
    }
  }

  const double count = result.requestDetails.size();
  const double averageWait = waitSum / count;
  result.averageWaitTime = roundedToTenth(averageWait);
  result.averageSeekDistance = roundedToTenth(seekSum / count);

  for (const auto& detail : result.requestDetails) {
    const bool starved = priorityAware
      ? detail.waitTime > averageWait * 1.5
      : detail.waitTime > averageWait * 1.5 ||
        detail.serviceOrderIndex > requests.size() * 0.7;
    if (starved) ++result.starvedRequestsCount;
  }

  result.starvationRiskScore = static_cast<int>(
    std::floor(static_cast<double>(result.starvedRequestsCount) /
      requests.size() * 100 + 0.5));
  result.prioritySatisfactionScore = highCount > 0
    ? static_cast<int>(std::floor(
        static_cast<double>(satisfiedHigh) / highCount * 100 + 0.5))
    : 100;
}

Result runStandard(const std::vector<Request>& requests, const val& params) {
  const int diskSize = params["diskSize"].as<int>();
  int currentHead = params["initialHead"].as<int>();
  string direction = params["direction"].as<string>();
  const int maxCylinder = std::max(0, diskSize - 1);
  Result result = makeEmptyResult("Standard SCAN", currentHead, direction);
  if (requests.empty()) return result;

  std::vector<Request> pending = requests;
  result.trace.clear();
  result.trace.push_back({0, "START", currentHead, direction, 0, 0, 0});
  int stepNumber = 1;

  while (!pending.empty()) {
    std::vector<Request> candidates;
    for (const auto& request : pending) {
      if ((direction == "right" && request.cylinder >= currentHead) ||
          (direction == "left" && request.cylinder <= currentHead)) {
        candidates.push_back(request);
      }
    }
    std::stable_sort(candidates.begin(), candidates.end(),
      [&direction](const Request& a, const Request& b) {
        return direction == "right" ? a.cylinder < b.cylinder
                                    : a.cylinder > b.cylinder;
      });

    for (const auto& request : candidates) {
      appendService(result, request, currentHead, direction, stepNumber);
      const auto found = std::find_if(pending.begin(), pending.end(),
        [&request](const Request& item) { return item.id == request.id; });
      if (found != pending.end()) pending.erase(found);
    }

    if (!pending.empty()) {
      const int boundary = direction == "right" ? maxCylinder : 0;
      if (currentHead != boundary) {
        appendBoundary(result, boundary, currentHead, direction, stepNumber);
      }
      direction = direction == "right" ? "left" : "right";
      ++result.directionChanges;
    }
  }

  calculateMetrics(result, requests, false);
  return result;
}

Result runPriorityAware(const std::vector<Request>& requests, const val& params) {
  const int diskSize = params["diskSize"].as<int>();
  int currentHead = params["initialHead"].as<int>();
  string direction = params["direction"].as<string>();
  const int burstLimit = params["burstLimit"].as<int>();
  const int maxCylinder = std::max(0, diskSize - 1);
  Result result = makeEmptyResult(
    requests.empty() ? "Priority-Aware SCAN"
                     : "Priority-Aware SCAN + Burst-Throttling",
    currentHead, direction);
  if (requests.empty()) return result;

  std::vector<Request> pending = requests;
  result.trace.clear();
  result.trace.push_back({0, "START", currentHead, direction, 0, 0, 0});
  int stepNumber = 1;
  int highBurstCount = 0;

  while (!pending.empty()) {
    std::vector<Request> candidates;
    for (const auto& request : pending) {
      if ((direction == "right" && request.cylinder >= currentHead) ||
          (direction == "left" && request.cylinder <= currentHead)) {
        candidates.push_back(request);
      }
    }

    if (candidates.empty()) {
      const int boundary = direction == "right" ? maxCylinder : 0;
      if (currentHead != boundary && !pending.empty()) {
        appendBoundary(result, boundary, currentHead, direction, stepNumber);
      }
      direction = direction == "right" ? "left" : "right";
      ++result.directionChanges;
      for (const auto& request : pending) {
        if ((direction == "right" && request.cylinder >= currentHead) ||
            (direction == "left" && request.cylinder <= currentHead)) {
          candidates.push_back(request);
        }
      }
    }
    if (candidates.empty()) candidates = pending;

    std::vector<Request> lowerPriority;
    for (const auto& request : candidates) {
      if (request.priority == "MEDIUM" || request.priority == "LOW") {
        lowerPriority.push_back(request);
      }
    }

    bool throttled = false;
    Request chosen = candidates.front();
    if (highBurstCount >= burstLimit && !lowerPriority.empty()) {
      std::stable_sort(lowerPriority.begin(), lowerPriority.end(),
        [&currentHead](const Request& a, const Request& b) {
          const int distanceA = std::abs(a.cylinder - currentHead);
          const int distanceB = std::abs(b.cylinder - currentHead);
          if (distanceA != distanceB) return distanceA < distanceB;
          return priorityScore(a.priority) > priorityScore(b.priority);
        });
      chosen = lowerPriority.front();
      highBurstCount = 0;
      throttled = true;
      ++result.throttlingEvents;
    } else {
      std::stable_sort(candidates.begin(), candidates.end(),
        [&currentHead](const Request& a, const Request& b) {
          const int scoreA = priorityScore(a.priority);
          const int scoreB = priorityScore(b.priority);
          if (scoreA != scoreB) return scoreA > scoreB;
          return std::abs(a.cylinder - currentHead) <
                 std::abs(b.cylinder - currentHead);
        });
      chosen = candidates.front();
      highBurstCount = chosen.priority == "HIGH" ? highBurstCount + 1 : 0;
    }

    appendService(
      result, chosen, currentHead, direction, stepNumber, throttled, true);
    const auto found = std::find_if(pending.begin(), pending.end(),
      [&chosen](const Request& item) { return item.id == chosen.id; });
    if (found != pending.end()) pending.erase(found);
  }

  calculateMetrics(result, requests, true);
  return result;
}

val standardScan(const val& inputRequests, const val& params) {
  return resultToValue(runStandard(readRequests(inputRequests), params));
}

val priorityAwareScan(const val& inputRequests, const val& params) {
  return resultToValue(runPriorityAware(readRequests(inputRequests), params));
}

}  // namespace

EMSCRIPTEN_BINDINGS(disk_scheduler) {
  emscripten::function("runStandardScan", &standardScan);
  emscripten::function("runPriorityAwareScan", &priorityAwareScan);
}
