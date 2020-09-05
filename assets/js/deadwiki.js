window.onload = () => {
  // focus the element with id=focused
  var focused = document.querySelector("#focused");
  if (focused && focused.value == "") focused.focus();
  // or class=focused
  var focused = document.querySelector(".focused");
  if (focused && focused.value == "") focused.focus();

  // dbl click wiki content to edit
  var editLink = document.querySelector("#edit-link");
  if (editLink) {
    window.addEventListener("dblclick", function () {
      window.location = editLink.href;
    });
  }

  // markdown editor
  var simplemde = new SimpleMDE({
    autofocus: !focused || focused.value != "",
    autoDownloadFontAwesome: false,
    blockStyles: {
      italic: "_",
    },
    indentWithTabs: false,
    renderingConfig: {
      singleLineBreaks: false,
      codeSyntaxHighlighting: true,
    },
    status: false,
    tabSize: 4,
    element: document.querySelector("#markdown"),
  });
};

document.onkeydown = (e) => {
  e = e || window.event || {};

  // check if we're running the native app
  if (document.querySelector("#main.webview-app")) {
  }

  // history navigation
  if (e.metaKey && (e.key == "[" || e.keyCode == 37)) {
    // history back: cmd+[ or cmd+left-arrow
    e.preventDefault();
    history.back();
    return;
  } else if (e.metaKey && (e.key == "]" || e.keyCode == 47)) {
    // history forward: cmd+] or cmd+right-arrow
    e.preventDefault();
    history.forward();
    return;
  }

  // global shortcuts for pages that don't have the editor
  if (!document.querySelector("#markdown")) {
    // ctrl-h goes home
    if (e.ctrlKey && e.key == "h") {
      e.preventDefault();
      return (window.location = "/");
    }

    // ctrl-j jump to page
    if (e.ctrlKey && e.key == "j") {
      e.preventDefault();
      return (window.location = "/jump");
    }

    // ctrl-n new / i insert
    if (e.key == "i" || (e.ctrlKey && e.key == "n")) {
      e.preventDefault();
      return (window.location = "/new");
    }

    // ctrl-e edit / i insert mode
    var editLink = document.querySelector("#edit-link");
    if (editLink && ((e.ctrlKey && e.key == "e") || e.key == "i")) {
      e.preventDefault();
      return (window.location = editLink.href);
    }

    ////
    // everything after this are shortcuts only for the editor
    return;
  }

  // ESC key to go back when editing
  if (e.keyCode == 27) {
    e.preventDefault();
    return history.back();
  }

  // CTRL+ENTER to submit when editing
  if ((e.ctrlKey || e.metaKey) && e.keyCode == 13) {
    e.preventDefault();
    return document.querySelector("#form").submit();
  }
};