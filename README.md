#Try Frege#
This is the online REPL for Frege available at this URL: http://try.frege-lang.org/.


##Build from sources and run locally##

1. Frege is not available on Maven central yet so we need to manually download and install it in local maven repository. For example, if the downloaded Frege jar is frege3.21.586-g026e8d7.jar then we can install it using, 
   
   `mvn install:install-file -DgroupId=frege -DartifactId=frege -Dversion=3.21.586-g026e8d7 -Dfile=/path/to/frege/frege3.21.586-g026e8d7.jar -Dpackaging=jar`
2. Checkout this project and then from project root,
   
   `mvn install`
3. To run,

   `mvn -pl try-frege-web jetty:run-war`
   
   The application will be running on [http://localhost:8080/tryfrege](http://localhost:8080/tryfrege).
