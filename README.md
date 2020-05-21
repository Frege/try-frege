# Try Frege   [![Build Status](https://travis-ci.org/Frege/try-frege.svg)](https://travis-ci.org/Frege/try-frege)
This is the online REPL for Frege available at this URL: http://86.119.37.112:9999 
(soon to be available again under http://try.frege-lang.org/).



## Build from sources and run locally ##

1. Checkout this project and then from project root,
   
   `mvn install`
   
2. To run,

   `mvn -f try-frege-web jetty:run-war`   
   
   The application will be running on [http://localhost:8080/tryfrege](http://localhost:8080/tryfrege).

   To run it on port 9999 use
      
   `mvn -f try-frege-web jetty:run-war -Djetty.http.port=9999`
   
## Build info (internal)

How to build and run with jetty runner from https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-runner/9.4.28.v20200408/

    `mvn package && java -jar jetty-runner.jar try-frege-web/target/tryfrege.war`
    
    Add --port 9999 to set the port when running jetty-runner.


   
