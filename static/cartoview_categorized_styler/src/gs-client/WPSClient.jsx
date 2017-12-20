import { getUrlWithQS } from './utils.jsx'

const InputBuilder = {
    featureCollection: (identifier, featureType) => {
        return {
            identifier,
            reference: {
                mimeType: "text/xml; subtype=wfs-collection/1.0",
                href: "http://geoserver/wfs",
                method: "POST",
                body: {
                    wfs: {
                        version: "1.0.0",
                        outputFormat: "GML2",
                        featureType
                    }
                }
            }
        }
    },
    literalData: (identifier, value) => {
        return {
            identifier,
            data: {
                literalData: {
                    value
                }
            }
        }
    }
};
const OutputBuilder = (format) => {
    const formats = {
        xml: "text/xml",
        json: "application/json"
    }
    return {
        rawDataOutput: {
            identifier: "result",
            mimeType: formats[format]
        }
    }
}

class WPSClient {
    url = URLS.geoserver + "wps"
    gsUnique(featureType, attribute) {
        var inputs = {
            featureCollection: { features: featureType },
            literalData: { attribute }
        }
        return this.execute("gs:Unique", inputs, "json").then(res => {
            try{
                return res.json()
            }catch(err){
                throw err
            }
        })
    }
    /*
      options includes {attribute, stats, method, classes, noData}
    */
    vecFeatureClassStats(featureType, options) {
        var inputs = {
            featureCollection: { features: featureType },
            literalData: options
        }
        return this.execute("vec:FeatureClassStats", inputs, "xml").then(res => res.text()).then(xml => {
            const doc = new DOMParser().parseFromString(xml, 'application/xml'),
                classes = doc.getElementsByTagName('Class'),
                rules = [];
            return Array.from(classes).map(c => {
                const min = c.getAttribute('lowerBound'),
                    max = c.getAttribute('upperBound'),
                    count = c.getAttribute('count');
                return { min, max, count, label: min + ' - ' + max };
            });
        });
    }
    execute(identifier, inputs, outputFormat) {
        var dataInputs = [];
        Object.keys(inputs).forEach((inputType) => {
            Object.keys(inputs[inputType]).forEach((key) => {
                dataInputs.push(InputBuilder[inputType](key, inputs[inputType][key]))
            });
        });
        var process = {
            identifier: identifier,
            responseForm: OutputBuilder(outputFormat),
            dataInputs: dataInputs
        }
        var xml = new OpenLayers.Format.WPSExecute().write(process);
        return fetch(URLS.geoserver + "wps", {
            method: "POST",
            credentials: "include",
            body: xml,
            headers: new Headers({
                "Content-Type": "application/xml"
            })
        });
    }
}

export default new WPSClient();
