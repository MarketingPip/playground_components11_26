// Import necessary modules
import * as d3 from "https://esm.sh/d3";
import * as markmap from "https://esm.sh/markmap-lib";
import { Markmap, loadCSS, loadJS } from "https://esm.sh/markmap-view";
// Function to render the Markmap
function renderMarkmap(markdown, opts = { duration: 0 }, id) {
  const { Transformer } = markmap;

  const transformer = new Transformer();
  const { root, features } = transformer.transform(markdown);

  // Extract used assets (CSS and JS)
  const { styles, scripts } = transformer.getUsedAssets(features);

  // Load the assets (if any)
  if (styles) loadCSS(styles);
  if (scripts) {
    loadJS(scripts, {
      getMarkmap: () => markmap
    });
  }

  // Create the mindmap
  return Markmap.create(id, opts, root);
}
export default renderMarkmap
