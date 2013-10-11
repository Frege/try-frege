$(document).ready(function(){

  var hwEditor =
  CodeMirror.fromTextArea(document.getElementById("helloworldEditor"),
  {
        theme: 'blackboard',
        lineNumbers: true,
        readOnly: true
  }).setValue(    "module helloworld.Main where\n\n" +
                  "quicksort :: Ord a => [a] -> [a]\n" +
                  "quicksort []     = []\n" +
                  "quicksort (p:xs) = (quicksort lesser) ++ [p] ++ (quicksort greater) where\n" +
                  "  lesser  = filter (< p) xs\n" +
                  "  greater = filter (>= p) xs\n\n" +
                  "main _ = println $ quicksort [2,5,4,3,1,7,6]\n");

  $("#tabs" ).tabs();
  $("#tabs").height($(window).height() * 0.9);
  $("div.console").height($("#tabs").height() * 0.8);
  $("div.input").height($("#tabs").height() * 0.8);

  var pasteMode = false;
  var tutorialMode = false;
  var tutPage = 1;
  var console = $('div.console');

  function successHandler(report) {
    return function(data) {
      document.body.style.cursor = 'default';
      var msgType = $(data).find("type").text();
      if (msgType == "ERROR") {
        var msg = $(data).find("message").text();
        report([{'msg': msg, 'className': "jquery-console-message-error"}])
      } else if (msgType == "SUCCESS") {
        var msg = $(data).find("message").text();
        var out = $(data).find("out").text();
        var err = $(data).find("err").text();
        var msgs = [{'msg':msg, 'className': "jquery-console-message-success"}];
        if ($.trim(err) != "") {
           msgs.unshift({'msg':err, 'className': "jquery-console-message-error"});
        }

        if ($.trim(out) != "") {
           msgs.unshift({'msg':out, 'className': "jquery-console-message-success"});
        }
        report(msgs);
      } else if (msgType == "MESSAGE") {
        var msg = $.trim($(data).find("message").text());
        report([{'msg': msg, 'className': "jquery-console-message-info"}]);
      } else {
        report([{'msg': "", 'className': "jquery-console-message-success"}]);
      }
      scrollDown();
    }
  }
        
  function failureHandler(report) {
    return function(req, status, error) { 
      document.body.style.cursor = 'default';
      report([{msg:error, className: 'ERROR'}]);
      scrollDown();
      };
  }
  function fregeEval(line, report) {
    if ($.trim(line) == '') {
      report("");
    } else {
      document.body.style.cursor = 'wait';
      $.post('eval/', {"cmd": line},
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
       if (line.match(/:}\s*$/i)) {
         controller.continuedPrompt = false;
         pasteMode = false;
         var lines = line.split("\n");
         var script = lines.slice(1, lines.length - 1);
         fregeEval(script.join("\n"), report);
       } else {
         controller.continuedPrompt = true;
       }
     } else if (line.match(/^:\{/i)) {
       pasteMode = true;
       controller.continuedPrompt = true;
     } else if (line.match(/^:c/i)) {
       controller.reset();
     } else if (tutorialMode && line.match(/^:.*/)) {
       if (line.match(/:q.*/i)) {
          tutorialMode = false;
          tutPage = 1;
          navigateTutorial('hide');
          $("div.console").parent().animate({width:"100%"}, "slow");
          report("Exiting tutorial!");
        } else if (line.match(/^:\d+$/) || line == ":next" || line == ":prev") {
          var tutorialCmd = line.substring(1);
          navigateTutorial(tutorialCmd);
          report("");
        } else {
          fregeEval(line, report);
        }
     } /*
         * else if (line.match(/^:tutorial/i)) { tutorialMode = true;
         * $("div.console").parent().css({width:"50%"});
         * $("#tutorial").parent().css({width:"50%"}, "slow");
         * $("#tutorial").show(); navigateTutorial(tutPage); report("Entering
         * tutorial... Type :q to exit.\n" + "You can browse through tutorial by
         * typing :1 for tutorial 1,\n" + ":2 for tutorial 2 and so on or by
         * typing :next and :prev.\n" + "On the right side, the tutorial
         * contents will be displayed."); }
         */ else {
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
     'to get them evaluated.\nType ":help" for more information.'
 });
 controller.promptText('');
      
  window.github = new Github({
         token: "", // Place a valid oauth token here
         auth: "oauth"
       });
  window.markdown = new Showdown.converter();
  
  window.repo = github.getRepo("frege", "try-frege");
  
  consoleWindow = controller;
});

function pasteCode(code) {
  consoleWindow.promptText(code);
}

function navigateTutorial(cmd) {
  if (cmd == "hide") {
    $("#tutorial").html("");
    $("#tutorial").hide();
  } else if (cmd == "next") {
    navigateTutorial(tutPage + 1);
  } else if (cmd == "prev") {
    navigateTutorial(tutPage - 1);
  } else {
    repo.read('master', "try-frege-web/src/main/webapp/tutorial/Tutorial-" + cmd + ".md", function(err, contents) {
          if (contents) {
            $("#tutorial").html(markdown.makeHtml(contents));
            tutPage = parseInt(cmd);
          }
    });
  }
}
