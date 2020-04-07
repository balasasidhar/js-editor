import 'normalize.css';
import './css/styles.css';

import JSEditor from './js/js-editor';

try {
  const editor = new JSEditor('editor');
  editor.loadDocument('Hello World');
  editor.addOnSaveListener((text) => {
    console.log(text);
  });
} catch (error) {
  console.error(error);
}
