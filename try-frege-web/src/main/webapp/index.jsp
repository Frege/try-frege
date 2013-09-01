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
						href="http://fregepl.blogspot.com/">Author's Blog</a></li>
          <li class="ui-state-default ui-corner-all"><a target="_blank"
						href="https://groups.google.com/forum/?fromgroups#!forum/frege-programming-language">Mailing List</a></li>
          
				</ul>
</td><td>
                             <div class="ui-widget-content ui-corner-all">
                                 <h1>What is Frege?</h1><div class="widget-area" role="complementary">
				<ul class="features">
					<li><a target="_blank" href="https://github.com/Frege/frege#readme">Frege</a>
					is a non-strict, pure functional programming language in the spirit
					of Haskell. </li>
          <li>It enjoys a strong static type system with type
					inference. Higher rank types are supported, though type annotations
					are required for that. </li>
          <li>Frege programs are compiled to Java and run
					in a JVM. </li>
          <li>Existing Java Classes and Methods can be used seamlessly
					from Frege. </li><li>The Frege programming language is named after and in
					honor of Gottlob Frege.</li>
				</ul></div>
                                </div><br/>
                                <div class="ui-widget-content ui-corner-all">
				<h1>Hello World!</h1>
				<pre>
					<code>
module helloworld.Main where

main _ = println "Hello World!"
</code>
				</pre>
                                </div>
                                </td></tr></table>
			</div>

</body>
</html>
​
