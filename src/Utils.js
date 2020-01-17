export default Object.freeze({
    download: (filename, text) => {
        let element = document.createElement('a');
        element.setAttribute('href', "data:text/json;utf8," + encodeURIComponent(JSON.stringify(text)));
        element.setAttribute('download', filename + '.json');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    },
    readTextFile: (file, callback) => {
        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = (e) => {
            let content = e.target.result;
            callback(content);
        }
    },
    getUngrouped: function(items) {
        if(items.length == 0) {
          return [];
        }
  
        let result = [];
  
        for(let i=0; i<items.length; i++) {
          let item = items[i];
  
          if(item.type == "shape")
            result.push(item)
          else if(item.type == "group") {
            for(let j=0; j<item.children.length; j++) {
              result.push(...this.getUngrouped([item.children[j]]));
            }
          }
  
          // Error catching - prevent infinite loop
          else {
            console.error("Unknown item type! Item was: " + item);
            return null;
          }
        }
  
        return result;
      }
});