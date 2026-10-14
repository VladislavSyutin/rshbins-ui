// Optional preparation step for PDFs with outlined text; no app runtime dependency.
import Foundation
import Vision
import ImageIO

let url = URL(fileURLWithPath: CommandLine.arguments[1])
let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.recognitionLanguages = ["ru-RU", "en-US"]
request.usesLanguageCorrection = false
let handler = VNImageRequestHandler(url: url)
try handler.perform([request])
let rows: [[String: Any]] = (request.results ?? []).compactMap { observation in
    guard let candidate = observation.topCandidates(1).first else { return nil }
    let box = observation.boundingBox
    return ["text": candidate.string, "x": box.minX, "y": 1 - box.maxY, "width": box.width, "height": box.height]
}
let data = try JSONSerialization.data(withJSONObject: rows, options: [.sortedKeys])
FileHandle.standardOutput.write(data)
