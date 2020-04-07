export default class JSEditor {
  #editorElementId = null;
  #editorRootElement = null;
  #editorHeaderElement = null;
  #editorBodyElement = null;
  #onSaveListener = null;

  constructor(targetId) {
    if (!targetId) throw new Error('Please pass a valid HTML ID attribute.');
    this.#editorElementId = targetId;
    this.#editorRootElement = document.getElementById(targetId);

    if (!this.#editorRootElement) {
      throw new Error(`No HTML element found with ID "${targetId}"`);
    }
    this.#init();
  }

  #init = () => {
    this.#editorRootElement.classList.add('editor');

    this.#editorHeaderElement = this.#createHeaderSection();
    this.#editorBodyElement = this.#createBodySection();

    this.#editorRootElement.appendChild(this.#editorHeaderElement);
    this.#editorRootElement.appendChild(this.#editorBodyElement);

    this.#editorBodyElement.focus();
  };

  #createHeaderSection = () => {
    const element = document.createElement('DIV');
    element.classList.add('editor-header');

    const menuIcons = [
      {
        name: 'save',
        iconBaseClass: 'far',
        iconClass: 'fa-save',
        eventListener: this.#saveDocument,
      },
      {
        name: 'bold',
        iconBaseClass: 'fas',
        iconClass: 'fa-bold',
        eventListener: () => this.#format('bold'),
      },
      {
        name: 'italic',
        iconBaseClass: 'fas',
        iconClass: 'fa-italic',
        eventListener: () => this.#format('italic'),
      },
    ];

    menuIcons.forEach((item) => {
      const aElement = document.createElement('BUTTON');
      // aElement.setAttribute('href', 'javascript:void(0)');
      aElement.classList.add('icon');

      const iconElement = document.createElement('I');
      iconElement.classList.add(item.iconBaseClass);
      iconElement.classList.add(item.iconClass);

      aElement.appendChild(iconElement);
      aElement.onclick = item.eventListener;

      element.appendChild(aElement);
    });

    const findInput = document.createElement('INPUT');
    findInput.setAttribute('type', 'text');
    findInput.onblur = this.#find;

    element.appendChild(findInput);

    return element;
  };

  #createBodySection = () => {
    const element = document.createElement('DIV');
    element.classList.add('editor-body');
    element.setAttribute('contenteditable', 'true');
    element.setAttribute('spellcheck', 'true');
    element.setAttribute('id', 'editor-body');
    return element;
  };

  #saveDocument = (e) => {
    e.stopPropagation();
    const documentText = this.#editorBodyElement.innerHTML;
    if (this.#onSaveListener) this.#onSaveListener(documentText);
  };

  #format = (cmd, value) => {
    document.execCommand(cmd, false, value);
  };

  #find = ({ target: { value } }) => {
    if (!value.length) return;
    const documentText = this.#editorBodyElement.innerHTML;
    const wordStartIndex = documentText.search(new RegExp(value, 'i'));
    if (wordStartIndex === -1) {
      alert('Nothing found');
      return;
    }
    const [word] = documentText.match(new RegExp(value, 'gi'));

    var re = new RegExp(value, 'gi');
    while ((temp = re.exec(documentText))) {
      console.log('match found at ' + temp.index);
    }

    const wordLastIndex = wordStartIndex + word.length;

    const textNode = this.#editorBodyElement.firstChild,
      range = document.createRange(),
      sel = window.getSelection();

    range.setStart(textNode, wordStartIndex);
    range.setEnd(textNode, wordLastIndex);

    sel.removeAllRanges();
    sel.addRange(range);

    document.execCommand('hiliteColor');
  };

  loadDocument = (document) => {
    this.#editorBodyElement.innerHTML = document;
  };

  addOnSaveListener = (callback) => {
    this.#onSaveListener = callback;
  };
}
