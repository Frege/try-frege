$(document).ready(function(){
	$("#tabs" ).tabs();
	$("#tabs").height($(window).height() * 0.9)
	$("div.console").height($("#tabs").height() * 0.8);
	var pasteMode = false;
	var console = $('div.console');
	var state = {history: ''};
	function successHandler(report) {
		return function(data) {
			document.body.style.cursor = 'default';
			state.history = $(data).find("history").text();
		    report([{msg:$(data).find("result").text(),
		        className: ($(data).find("type").text() == "SUCCESS" ?
		        		"jquery-console-message-success" : 
		        		"jquery-console-message-error")}]);
		    scrollDown();
		  }
	}
	function failureHandler(report) {
		return function(req, status, error) { 
		  document.body.style.cursor = 'default';
		  report(error);
		  scrollDown();
		  };
	}
	function fregeEval(line, report) {
	  if ($.trim(line) == '') {
		  report("");
	  } else {
		  document.body.style.cursor = 'wait';
		  $.post(replurl, {"snippet": line, "history": state.history},
				  successHandler(report), "xml")
			.error(failureHandler(report))
	  }
	  
	}
	
	function scrollDown() {
		console.animate({"scrollTop": console[0].scrollHeight}, "slow");
	}
 var controller = console.console({
   promptLabel: 'frege> ',
   continuedPromptLabel: '',
   autofocus: true,
   commandHandle:function(line, report){
	   var line = $.trim(line);
	   if (pasteMode) {
		   if (line.match(/:q\s*$/i)) {
			   controller.continuedPrompt = false;
			   pasteMode = false;
			   var lines = line.split("\n");
			   var script = lines.slice(1, lines.length - 1);
			   fregeEval(script.join("\n"), report);
		   } else {
			   controller.continuedPrompt = true;
		   }
	   } else if (line.match(/^:p/i)) {
		   pasteMode = true;
		   controller.continuedPrompt = true;
	   } else if (line.match(/^:help/i)) {
		   report (helpMessage);
	   } else if (line.match(/^:c/i)) {
		   controller.reset();
	   } else if (line.match(/^:r/i)) {
		   state.history = '';
		   report([{msg: ''}]);
	   } else if (line.match(/^:h/i)) {
		   report([{msg: $.trim(state.history), className: 'jquery-console-message-info'}]);
	   } else {
		   try {
			   fregeEval(line, report);
		   } catch (e) {
			   return e.toString();
		   }
	   }
	   scrollDown();
   },
   animateScroll:true,
   promptHistory:true,
   welcomeMessage:'Welcome! Enter Frege code snippets at the prompt ' + 
   	'to get them evaluated. Type ":help" for more information.'
 });
 controller.promptText('');
 var helpMessage = [
    {msg: 'At the prompt, you can enter any Frege code to get ' +
		'them evaluated.', 
 	  className: 'jquery-console-message-info'},
 	{msg: 'The output or compilation errors are printed below the prompt.', 
 	  className: 'jquery-console-message-info'},
 	{msg: 'In addition to Frege code, the following commands are supported:', 
      className: 'jquery-console-message-info'},
	{msg: ':t <expression> - To print the type of an expression', 
      className: 'jquery-console-message-info'},
    {msg: ':p              - To enter paste mode, for multi-line/multiple definitions', 
      className: 'jquery-console-message-info'},
    {msg: ':q              - To quit paste mode', 
      className: 'jquery-console-message-info'},
    {msg: ':l              - To list the identifiers along with types', 
      className: 'jquery-console-message-info'},
    {msg: ':h              - To display the scripts evaluated so far', 
      className: 'jquery-console-message-info'},
    {msg: ':version        - To display Frege version', 
          className: 'jquery-console-message-info'},
    {msg: ':c              - To clear the console. The session will continue to be active.', 
      className: 'jquery-console-message-info'},
    {msg: ':r              - To reset the session discarding all evaluated scripts', 
      className: 'jquery-console-message-info'},
    {msg: ':help           - To display this help message', 
      className: 'jquery-console-message-info'}];
});
  
function setup(urlIn) {
	replurl = urlIn
}

