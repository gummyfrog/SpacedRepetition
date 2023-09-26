//
//  RepeaterApp.swift
//  Repeater
//
//  Created by Neil on 9/4/23.
//

import SwiftUI

@main
struct RepeaterApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
