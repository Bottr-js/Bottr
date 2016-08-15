//
//  WitAiRouter.swift
//  Nancy
//
//  Created by James Campbell on 7/23/16.
//  Copyright © 2016 Nancy. All rights reserved.
//

import Foundation

// Router for the Wit.ai service
public class WitAiRouter: Router {

    public var delegate: RouterDelegate?

    let apiHost = "https://api.wit.ai/"
    let apiVersion = "20160516"

    let accessToken: String

    /**
     Creates a new instance of a Wit.ai Router

     - parameter accessToken: the access token used by the router to connect to
                 the service

     - returns: The instance of the new Router
     */
    public init(accessToken: String) {
        self.accessToken = accessToken
    }

    public func route(request: Request, callback: (Context) -> Void) {
        runActions(request: request, callback: callback)
    }

    private func runActions(request: Request, maxSteps: Int = 5, callback: (Context) -> Void) {

        guard maxSteps > 0 else {
            return
        }

        return converse(sessionID: request.sessionID, message: request.message, context: request.context) {

            json in

            guard var type = json["type"] as? String else {
                callback(request.context)
                return
            }

           var action = json["action"] as? String ?? "send"

            // backwards-compatibility with API version 20160516
            if type == "merge" {
                type = "action"
                action = "merge"
            }

            var userInfo: [String: Any] = [:]

            if let entities = json["entities"] {
                userInfo["entities"] = entities
            }

            if let text = json["msg"] {
                userInfo["text"] = text
            }

            if let replies = json["quickreplies"] {
                userInfo["quickreplies"] = replies
            }

            let event = Event(context:request.context, sessionID:request.sessionID, userInfo:userInfo)
            var newContext = request.context

            switch type {
                case "error":
                    fatalError("Oops, I don\'t know what to do.")
                case "stop":
                    callback(request.context)
                    return
                case "msg":
                    newContext = self.delegate?.router(self, triggerActionWithName: "send", forEvent: event) ?? [:]
                case "action":
                    newContext = self.delegate?.router(self, triggerActionWithName: action, forEvent: event) ?? [:]
                default:
                    fatalError("unknown type: #{json['type']}")
            }

            let request = Request(context:newContext, message:nil, sessionID:request.sessionID)
            self.runActions(request: request, maxSteps: maxSteps - 1, callback:callback)
        }
    }

    private func converse(sessionID: String, message: String?, context: Context, callback: (Context) -> Void) {

        var params: [String: String] = [
            "session_id": sessionID
        ]

        if let message = message {
            params["q"] = message
        }

        return makeRequest(path: "converse", method: "POST", params: params, context: context, callback: callback)
    }

    private func makeRequest(path: String, method: String, params: [String: String], context: Context, callback: (Context) -> Void) {

        let apiUrl = try! URL(string: apiHost)?.appendingPathComponent(path).appendQueryString(params: params)

        guard let url = apiUrl else {
          callback([:])
          return
        }

        let client = HTTPClient()
        let request = URLRequest(url: url)

        request.method = .POST
        request.headers = [
          "Content-Type": "application/json",
          "Accept": "application/vnd.wit.\(apiVersion)+json",
          "Authorization": "Bearer \(accessToken)"
        ]
        request.params = context

        client.makeRequest(request, callback: callback)
    }
}
