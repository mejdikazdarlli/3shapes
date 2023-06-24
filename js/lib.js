export  function getelmentFromRoot(a,b) {
    return {
        Elm: document.querySelector(a).shadowRoot.querySelector(b)
      };
  }