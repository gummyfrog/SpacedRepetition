# Tempel

## Overview

Contained in this repository are the outlines for all four components required to run Tempel.

### A. The Application Server, Database & Web Interface

The Application server is contained in `/application_server`. It is a barebones Express server that utilizes the sqlite3 package to create an in-memory sqlite database. It exposes a number of endpoints which facilitate interaction between the two interfaces (mobile and web) and the database.

### B. The Mobile Application

The iOS application is contained in `/ios_application`. It is a barebones SwiftUI app which currently has the Push Notifications privilege enabled. 


## Installation

### Server, Database & Web Interface
Prerequisites:
    You must have Node installed on your machine.

First, clone this GitHub repository.

#### Development
For development, install the required node packages with `npm i`. 
You can then start the Tempel application server, database and web interface by running `node StartTempel.js`.

#### Production
For production, simply build the Tempel image using the included Dockerfile.
`docker build -t tempel:latest .`

Then, run `docker compose up` in the same directory as the included docker-compose file to start Tempel.

### iOS Application

Prerequisites:
    An active Apple Developer License.
    An iOS-capable device.
    A working install of xCode and xCode command line tools.


#### Development
For development, simply create an xCode project with the included Swift code. Sign your project, and build.