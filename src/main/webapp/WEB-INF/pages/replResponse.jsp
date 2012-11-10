<%@ page language="java" contentType="text/xml; charset=UTF-8"
  pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<repl>
  <result><![CDATA[${result.message}]]></result>
  <type>${result.messageType}</type>
  <history><![CDATA[${history != null ? history : param.history}]]></history>
</repl>