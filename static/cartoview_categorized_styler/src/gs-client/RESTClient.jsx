import WMSClient from "./WMSClient.jsx";
import {getCRSFToken} from '../helpers/helpers'
class RESTClient {
    url = URLS.geoserverRestProxy
    _styles = {}
    format = new OpenLayers.Format.SLD( { multipleSymbolizers: true } )
    getStyle( layerName, styleName ) {
        if ( styleName == "new" ) {
            return new Promise( ( resolve, reject ) => {
                resolve( this.getNewStyle( layerName, styleName ) );
            } )
        }
        if ( this._styles[ styleName ] ) {
            return new Promise( ( resolve, reject ) => {
                resolve( this._styles[ styleName ] );
            } )
        }
        const url = this.url + "/styles/" + styleName + ".sld";
        return fetch( url, {
            credentials: 'include',
        } ).then( res => res.text() ).then( ( res ) => {
            const sld = res.trim();
            const styleObj = this.format.read( sld );
            var config = { layerName };
            const { description } = styleObj.namedLayers[
                styleName ].userStyles[ 0 ];
            try {
                Object.assign( config, JSON.parse( description ) );
            } catch ( err ) {}
            styleObj.config = config;
            this._styles[ styleName ] = styleObj;
            return styleObj;
        } );
    }
    _modify( url, method, SLD ) {
        return fetch( url, {
            method: method,
            credentials: "include",
            body: SLD,
            headers: new Headers( {
                "Content-Type": "application/vnd.ogc.sld+xml; charset=UTF-8",
                "X-CSRF_TOKEN": getCRSFToken()
            } )
        } )
    }
    assignStyle( layerName, styleName ) {
        return WMSClient.getLayerStyles( layerName ).then( ( styles ) => {
            const url = this.url + "/layers/" + layerName +
                ".json";
            var defaultStyle;
            styles = styles.map( ( s ) => {
                if ( s.isDefault ) defaultStyle = s.name;
                return {
                    name: s.name
                }
            } );
            styles.push( { name: styleName } )
            const jsonStr = JSON.stringify( {
                layer: {
                    defaultStyle: {
                        name: defaultStyle || styleName
                    },
                    styles: { style: styles },
                    enabled: true
                }
            } )
            return fetch( url, {
                method: "PUT",
                credentials: "include",
                body: jsonStr,
                headers: new Headers( {
                    "Content-Type": "application/json; charset=UTF-8",
                    "X-CSRF_TOKEN": getCRSFToken()
                } )
            } ).then( () => {
                return styleName;
            } )
        } )
    }
    createRule( symbolType ) {
        return new OpenLayers.Rule( {
            symbolizers: [ new OpenLayers.Symbolizer[ symbolType ] ]
        } );
    }
    createSLD( layerName, styleName ) {
        var sld = {
            version: "1.0.0",
            namedLayers: {}
        };
        var newStyle = new OpenLayers.Style( null, {
            name: styleName,
            title: styleName,
            rules: [ this.createRule( "Polygon" ) ]
        } );
        sld.namedLayers[ layerName ] = {
            name: layerName,
            userStyles: [ newStyle ]
        };
        var style = new OpenLayers.Format.SLD( {
            multipleSymbolizers: true,
            profile: "GeoServer"
        } );
        return style.write( sld );
    }
    addStyle( layerName ) {
        var styleName = layerName.split( ":" ).pop() + "_" + new Date().getTime();
        const url = this.url + "/styles";
        return this._modify( url, "POST", this.createSLD( layerName,
            styleName ) ).then( () => {
            return this.assignStyle( layerName, styleName );
        } );
    }
    saveStyle( layerName, styleName, sld ) {
        // const url = this.url + "/styles/"+ styleName + ".xml";
        // return this._modify(url, "PUT", sld);
        const url = URLS.stylesUrl + "/save/" + layerName + "/" +
            styleName;
        return fetch( url, {
            method: "POST",
            // credentials: "include",
            credentials: "same-origin",
            body: sld,
            headers: new Headers( {
                "Content-Type": "application/xml; charset=UTF-8",
                "X-CSRFToken": getCRSFToken()
            } )
        } );
    }
}
export default new RESTClient();
