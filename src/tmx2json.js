const pako = require('pako');

class tmx2json
{
  constructor(url) {
    fetch(url)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const tmx_map = xmlDoc.getElementsByTagName("map")[0];
      for(let i = 0; i < tmx_map.attributes.length; i++) {
        let name = tmx_map.attributes[i].name;
        let value = tmx_map.attributes[i].textContent;

        if(name === "version") continue;
        this[name] = value;
      }

      this.tilesets = [];
      this.layers = [];

      for(let i = 0; i < tmx_map.childNodes.length; i++) {
        let nodeName = tmx_map.childNodes[i].nodeName;
        switch(nodeName)
        {
          case "properties":
            this.properties = new Properties(tmx_map.childNodes[i]);
            break;
          case "tileset":
            this.tilesets.push(new Tileset(tmx_map.childNodes[i]));
            break;
          case "layer":
            this.layers.push(new Layer(tmx_map.childNodes[i]));
            break;
          case "#text":
            break;
          default:
            console.log("Unknown node " + nodeName);
            break;
        }
      }
    });
  }
}

class Properties
{
  constructor(xml) {
    for(let i = 0; i < xml.childNodes.length; i++) {
      let nodeName = xml.childNodes[i].nodeName;
      switch(nodeName)
      {
        case "property":
          let attr = xml.childNodes[i].attributes;
          for(let j = 0; j < attr.length; j++) {
            let name = attr[j].name;
            let value = attr[j].textContent;

            this[name] = value;
          }
          break;
        case "#text":
          break;
        default:
          console.log("Unknown node " + nodeName);
          break;
      }
    }
  }
}

class Tileset
{
  constructor(xml) {
    for(let i = 0; i < xml.attributes.length; i++) {
      let name = xml.attributes[i].name;
      let value = xml.attributes[i].textContent;

      this[name] = value;
    }

    for(let i = 0; i < xml.childNodes.length; i++) {
      let nodeName = xml.childNodes[i].nodeName;
      switch(nodeName)
      {
        case "properties":
          this.properties = new Properties(xml.childNodes[i]);
          break;
        case "image":
          this.image = new TMX_Image(xml.childNodes[i]);
          break;
        case "#text":
          break;
        default:
          console.log("Tileset: Unknown node " + nodeName);
          break;
      }
    }
  }
}

class Layer
{
  constructor(xml) {
    for(let i = 0; i < xml.attributes.length; i++) {
      let name = xml.attributes[i].name;
      let value = xml.attributes[i].textContent;

      this[name] = value;
    }

    for(let i = 0; i < xml.childNodes.length; i++) {
      let nodeName = xml.childNodes[i].nodeName;
      switch(nodeName)
      {
        case "#text":
          break;
        case "data":
          this.tiles = new TMX_Data(xml.childNodes[i]).tiles;
          break;
        default:
          console.log("Tileset: Unknown node " + nodeName);
          break;
      }
    }
  }
}

class TMX_Data
{
  constructor(xml) { 
    for(let i = 0; i < xml.attributes.length; i++) {
      let name = xml.attributes[i].name;
      let value = xml.attributes[i].textContent;

      this[name] = value;
    }

    let compressedData = atob(xml.innerHTML);
    let data = pako.inflate(compressedData);

    this.tiles = [];

    for(let i = 0; i < data.length; i += 4) {
      let value = (data[i + 3] << 24)
                + (data[i + 2] << 16)
                + (data[i + 1] << 8)
                + data[i + 0];

      let tile = {};
      if(value & 0x80000000) {
        tile.flipHorizontal = true;
        value ^= 0x80000000;
      }

      if(value & 0x40000000) {
        tile.flipVertical = true;
        value ^= 0x40000000;
      } 

      if(value & 0x20000000) {
        tile.flipDiagonal = true;
        value ^= 0x20000000;
      }
      tile.id = value - 1;
      
      this.tiles.push(tile);
    }
  }
}

class TMX_Image
{
  constructor(xml) {
    for(let i = 0; i < xml.attributes.length; i++) {
      let name = xml.attributes[i].name;
      let value = xml.attributes[i].textContent;

      this[name] = value;
    }
  }
}

export default tmx2json;
