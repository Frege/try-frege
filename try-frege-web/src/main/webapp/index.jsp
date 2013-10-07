<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
          "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<c:url var="replurl" value="/eval" />
<title>Frege REPL</title>
<meta name="Content-Type" content="text/html; charset=UTF-8">
<link rel="icon" type="image/png"
    href="http://code.google.com/p/frege/logo?cct=1332936855">
<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.console.js"></script>
<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/start/jquery-ui.css"/>
<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
<script src="${pageContext.request.contextPath}/js/repl.js"></script>
<script src="${pageContext.request.contextPath}/js/underscore-min.js"></script>
<script src="${pageContext.request.contextPath}/js/base64.js"></script>
<script src="${pageContext.request.contextPath}/js/github.js"></script>
<script src="${pageContext.request.contextPath}/js/showdown.js"></script>
<script src="${pageContext.request.contextPath}/lib/codemirror.js"></script>
<link rel="stylesheet"
    href="${pageContext.request.contextPath}/lib/codemirror.css">
<link rel="stylesheet"
    href="${pageContext.request.contextPath}/theme/solarized.css">
<link rel="stylesheet"
    href="${pageContext.request.contextPath}/theme/ambiance.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/theme/blackboard.css">
<script src="${pageContext.request.contextPath}/mode/haskell/haskell.js"></script>
<script type="text/javascript">
    replurl = '${replurl}';
</script>
<link rel="stylesheet"
    href="${pageContext.request.contextPath}/css/repl.css" />
</head>
<body
    style="margin-left: 50px; margin-right: 50px; margin-top: 15px; margin-bottom: 10px;">
    <noscript>
        <p>
            <strong>Please enable JavaScript or upgrade your browser.</strong>
        </p>
    </noscript>
    <div id="tabs" style="position: relative;">
        <ul>
            <li><a href="#tryfrege">Try Frege</a></li>
            <li><a href="#morefrege">About Frege</a></li>
        </ul>
        <div id="tryfrege">
            <table>
                <tr>
                    <td width="100%">
                        <div class=" console ui-corner-all"></div>
                    </td>
                    <td>
                        <div class="draggable " id="tutorial" style="display: none">
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div id="morefrege" align="center" >
            <table style="width:80%;align: center;"><tr><td width="40%">
<ul class="repolinks">
                    <li class="ui-state-default ui-corner-all"><a target="_blank"
                        href="https://github.com/Frege/frege/wiki/Getting-Started">Getting Started!</a></li>
          <li class="ui-state-default ui-corner-all"><a target="_blank"
                        href="https://github.com/Frege/frege/releases">Downloads (Binary, Language Reference, IDE and more)</a></li>
          <li class="ui-state-default ui-corner-all"><a target="_blank"
                        href="https://github.com/Frege/eclipse-plugin/wiki">Frege
                        Eclipse IDE</a></li>
          <li class="ui-state-default ui-corner-all"><a target="_blank"
                        href="https://github.com/Frege/frege/wiki/Differences-between-Frege-and-Haskell">Differences
                        between Frege and Haskell</a></li>
          <li class="ui-state-default ui-corner-all"><a target="_blank"
                        href="https://github.com/Frege/frege/wiki/Calling-Frege-Code-from-Java">Calling Frege from Java</a></li>
          <li class="ui-state-default ui-corner-all"><a target="_blank"
                        href="https://github.com/Frege/frege/tree/master/examples">Examples
    (Brainfuck, Euler, Sudoku, Java Swing and more)</a></li>
          <li class="ui-state-default ui-corner-all"><a target="_blank"
                        href="http://fregepl.blogspot.com/">Author's Blog</a></li>
          <li class="ui-state-default ui-corner-all"><a target="_blank"
                        href="https://groups.google.com/forum/?fromgroups#!forum/frege-programming-language">Mailing List</a></li>
          
                </ul>
</td><td>
      <div class="ui-widget-content ui-corner-all">
        <h4>What is Frege?</h4><div class="widget-area" role="complementary">
                <div class="features">
                    <div class="ui-state-highlight ui-corner-all"><strong>
                    A non-strict, pure functional programming language in the spirit
                    of Haskell</strong> </div>
          <div class="ui-state-highlight ui-corner-all"><strong>Strong static type system with type
                    inference </strong></div>
          <div class="ui-state-highlight ui-corner-all"><strong>Higher rank types are supported though type annotations
                    are required for that</strong></div>
          <div class="ui-state-highlight ui-corner-all"><strong>Compiled to Java and run
                    in a JVM</strong></div>
          <div class="ui-state-highlight ui-corner-all"><strong>Existing Java Classes and Methods can be used seamlessly
                    from Frege </strong></div>
          <div class="ui-state-highlight ui-corner-all"><strong>The Frege programming language is named after and in
                    honor of Gottlob Frege</strong></div>
                </div>
      </div>
                                </div><br/>

                                <div class="ui-widget-content ui-corner-all">
                                   <div >
                                        <div style="float:left;padding:2px"><strong>Hello World</strong></div><!--
                                        <div style="float:right;padding-right:6px;">
                                             <input type="button" value="Compile"/>
                                             <input type="button" value="Run"/>
                                        </div>-->
                                   <div>
                                   <div style="clear:both">
                                   <textarea id="helloworldEditor">

                                   </textarea>
                                   </div>
                                </div>

                                </td></tr></table>
            </div>

</body>
</html>
​