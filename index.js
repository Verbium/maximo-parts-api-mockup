// smb - mimic the Maximo Search Parts Catalogue 3 REST API calls

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000));

// function to mimic Maximo's mobile request, returns the XML
function createMobileRequestSession() {
	return '<?xml version="1.0" encoding="UTF-8"?><CreateMXCOG_MOBILEREQUESTResponse creationDateTime="2017-04-17T07:36:56+01:00" transLanguage="EN" baseLanguage="EN" messageID="3589120.1492411017298794818" maximoVersion="7 6 20160114-1313 V7603-151" xmlns="http://www.ibm.com/maximo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><MXCOG_MOBILEREQUESTSet><I_MOBREQUEST rowstamp="207576508"><I_MOBREQUESTID>12345</I_MOBREQUESTID><LATITUDEY>51.9950220000</LATITUDEY><LONGITUDEX>-2.1468512000</LONGITUDEX><REQUESTDATE>2017-04-17T07:36:57+01:00</REQUESTDATE></I_MOBREQUEST></MXCOG_MOBILEREQUESTSet></CreateMXCOG_MOBILEREQUESTResponse>';
}


// start a request session for Maximo to know where we are calling from
// Karel's example: http://iemc44.atrema.deloitte.com:9080/maxrest/rest/os/MXCOG_MOBILEREQUEST?latitudey=51.995022&longitudex=-2.1468512
// Note that this is a POST
app.post('/maxrest/rest/os/MXCOG_MOBILEREQUEST', function (req, res) {
    console.log('');
    console.log('*******************');
    console.log('Call to MXCOG_MOBILEREQUEST');
    console.log('req.query : '+JSON.stringify(req.query));

    // if the lat is "0.0" then we will return error 404, otherwise we return a fixed response.
    if (req.query.latitudey === '0.0') {
        console.log('returning 404');
	res.status(404).send('Not found');
    }
    else if (req.query.latitudey === '9.9') {
        console.log('not returning anything - to test timeout');
    }
    else {
        console.log('returning mock answer');
        var result = createMobileRequestSession();
	res.set('Content-Type', 'application/xml');
        res.send(result);
    }

    console.log('*******************');
})



// function to mimic search parts, returns the XML
function mxCogItemPartSearch() {
    return '<?xml version="1.0" encoding="UTF-8"?><QueryMXCOG_ITEMPSResponse creationDateTime="2017-04-17T07:58:38+01:00" transLanguage="EN" baseLanguage="EN" messageID="4591525.1492412319251985593" maximoVersion="7 6 20160114-1313 V7603-151" rsStart="0" rsTotal="1487" rsCount="5" xmlns="http://www.ibm.com/maximo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><MXCOG_ITEMPSSet><ITEM><COMMODITY>0110</COMMODITY><COMMODITYGROUP>18000</COMMODITYGROUP><DESCRIPTION>Filter 1000 X 220 X 12MM</DESCRIPTION><ITEMID>266</ITEMID><ITEMNUM>10111</ITEMNUM><ITEMSETID>ITEMSET1</ITEMSETID><I_LASTCOST>23.00</I_LASTCOST><I_LASTDATE>02/03/2017</I_LASTDATE><I_TOTALPURCH>46</I_TOTALPURCH></ITEM><ITEM><COMMODITY>0110</COMMODITY><COMMODITYGROUP>18000</COMMODITYGROUP><DESCRIPTION>Filter 620 X 225 X 23MM</DESCRIPTION><ITEMID>267</ITEMID><ITEMNUM>10112</ITEMNUM><ITEMSETID>ITEMSET1</ITEMSETID><I_LASTCOST>300.00</I_LASTCOST><I_LASTDATE>01/12/2016</I_LASTDATE><I_TOTALPURCH>1</I_TOTALPURCH></ITEM><ITEM><COMMODITY>1006</COMMODITY><COMMODITYGROUP>65000</COMMODITYGROUP><DESCRIPTION>Ex/Valve Sporlan Q External</DESCRIPTION><ITEMID>268</ITEMID><ITEMNUM>10113</ITEMNUM><ITEMSETID>ITEMSET1</ITEMSETID><I_LASTDATE>05/10/2016</I_LASTDATE></ITEM><ITEM><COMMODITY>1007</COMMODITY><COMMODITYGROUP>65000</COMMODITYGROUP><DESCRIPTION>Power Element Sporlan R409A LT</DESCRIPTION><ITEMID>269</ITEMID><ITEMNUM>10114</ITEMNUM><ITEMSETID>ITEMSET1</ITEMSETID></ITEM><ITEM><COMMODITY>0330</COMMODITY><COMMODITYGROUP>64000</COMMODITYGROUP><DESCRIPTION>Power Element Sporlan  R134A H</DESCRIPTION><ITEMID>270</ITEMID><ITEMNUM>10115</ITEMNUM><ITEMSETID>ITEMSET1</ITEMSETID><I_LASTCOST>14.99</I_LASTCOST></ITEM></MXCOG_ITEMPSSet></QueryMXCOG_ITEMPSResponse>';
}



// search for parts
// Karel's example: http://iemc44.atrema.deloitte.com:9080/maxrest/rest/os/MXCOG_ITEMPS?_uw=commoditygroup%3D%27200%27&_maxItems=5
app.get('/maxrest/rest/os/MXCOG_ITEMPS', function (req, res) {
    console.log('');
    console.log('*******************');
    console.log('Call to MXCOG_ITEMPS');
    console.log('req.query : '+JSON.stringify(req.query));
    console.log('req.headers : '+JSON.stringify(req.headers));

    // if query where includes CG2 then mimic some error cases
    if (req.query._uw.indexOf('CG2') > 0) {
	// don't return anything
        // console.log('not returning anything - to mimic time out');
	// return;

	// simulate 404
        // console.log('part missing, returning 404');
	// res.status(404).send('Not found');

    	console.log('returning 0 matches');
        var result0 = '<?xml version="1.0" encoding="UTF-8"?><QueryMXCOG_ITEMPSResponse creationDateTime="2017-04-17T07:58:38+01:00" transLanguage="EN" baseLanguage="EN" messageID="4591525.1492412319251985593" maximoVersion="7 6 20160114-1313 V7603-151" rsStart="0" rsTotal="0" rsCount="5" xmlns="http://www.ibm.com/maximo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><MXCOG_ITEMPSSet></MXCOG_ITEMPSSet></QueryMXCOG_ITEMPSResponse>';
	res.set('Content-Type', 'application/xml');
        res.send(result0);
}
    else {
	console.log('returning hard-coded matches');
        var result = mxCogItemPartSearch();
	res.set('Content-Type', 'application/xml');
        res.send(result);
    }

    console.log('*******************');
})





// function to mimic get parts, returns the XML
function getMobRequest(mobreq) {
    return '<?xml version="1.0" encoding="UTF-8"?><I_DISTANCEMboSet rsStart="0" rsTotal="7" rsCount="4" xmlns="http://www.ibm.com/maximo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><I_DISTANCE xmlns="http://www.ibm.com/maximo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><I_MOBREQUESTID>1</I_MOBREQUESTID><REQLONGITUDEX>-2.1468512000</REQLONGITUDEX><REQLATITUDEY>51.9950220000</REQLATITUDEY><ITEMNUM>10120</ITEMNUM><VENDOR>P10016</VENDOR><NAME>Tool Station Bristol Whiteladies Road</NAME><ADDLONGITUDEX>2.6115700000</ADDLONGITUDEX><ADDLATITUDEY>51.4606545000</ADDLATITUDEY><DISTANCE>330</DISTANCE><Manufacturer>Man1</Manufacturer><Modelnum>Model1</Modelnum><STREETADDRESS>Addr1</STREETADDRESS><Catalogcode>Cat1</Catalogcode></I_DISTANCE><I_DISTANCE xmlns="http://www.ibm.com/maximo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><I_MOBREQUESTID>1</I_MOBREQUESTID><REQLONGITUDEX>-2.1468512000</REQLONGITUDEX><REQLATITUDEY>51.9950220000</REQLATITUDEY><ITEMNUM>10120</ITEMNUM><VENDOR>P10010</VENDOR><NAME>Climate Parts Centre</NAME><ADDLONGITUDEX>5.0390400000</ADDLONGITUDEX><ADDLATITUDEY>2.8886000000</ADDLATITUDEY><DISTANCE>3424</DISTANCE></I_DISTANCE><I_DISTANCE xmlns="http://www.ibm.com/maximo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><I_MOBREQUESTID>1</I_MOBREQUESTID><REQLONGITUDEX>-2.1468512000</REQLONGITUDEX><REQLATITUDEY>51.9950220000</REQLATITUDEY><ITEMNUM>10120</ITEMNUM><VENDOR>P10002</VENDOR><NAME>DEAN &amp; WOOD</NAME><ADDLONGITUDEX>5.0390400000</ADDLONGITUDEX><ADDLATITUDEY>2.8886000000</ADDLATITUDEY><DISTANCE>3424</DISTANCE></I_DISTANCE><I_DISTANCE xmlns="http://www.ibm.com/maximo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><I_MOBREQUESTID>1</I_MOBREQUESTID><REQLONGITUDEX>-2.1468512000</REQLONGITUDEX><REQLATITUDEY>51.9950220000</REQLATITUDEY><ITEMNUM>10120</ITEMNUM><VENDOR>P10015</VENDOR><NAME>Tool Station</NAME><ADDLONGITUDEX>5.0390400000</ADDLONGITUDEX><ADDLATITUDEY>2.8886000000</ADDLATITUDEY><DISTANCE>3424</DISTANCE></I_DISTANCE></I_DISTANCEMboSet>';
}



// get a part and it suppliers
// Karel's example: http://iemc44.atrema.deloitte.com:9080/maxrest/rest/mbo/I_MOBREQUEST/1/I_DISTANCE?_maxItems=10&itemnum=10120&_orderbyasc=distance
app.get('/maxrest/rest/mbo/I_MOBREQUEST/:mobreq/I_DISTANCE', function (req, res) {
    console.log('Call to I_MOBREQUEST');
    console.log('req.query : '+JSON.stringify(req.query));
    console.log('req.headers : '+JSON.stringify(req.headers));

    var mobreq = req.params.mobreq;
    console.log('mobreq='+mobreq);

    // simulate a time out
    // console.log('not returning anything - to mimic time out');
    // return;

    // simulate 404
    // console.log('part missing, returning 404');
    // res.status(404).send('Not found');
    // return;

    // returning a hard-code result
    console.log('returning hard-coded matches');
    var result = getMobRequest(mobreq);
    res.set('Content-Type', 'application/xml');
    res.send(result);
})




app.listen(app.get('port'), function() {
  console.log('Maximo Search Parts REST API Mockup is running on port', app.get('port'));
});


