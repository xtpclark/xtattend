debugger;
try

{
  var _coheadid = -1;

  var _orderNumber = mywindow.findChild("_orderNumber");
  var _cust = mywindow.findChild("_cust");
  var _shipToName = mywindow.findChild("_shipToName");
  var _shipToAddr = mywindow.findChild("_shipToAddr");
  var _shipToCntct = mywindow.findChild("_shipToCntct");

//  var _layout  = toolbox.widgetGetLayout(mywindow.findChild("_orderNumber"));
  var _layout  = toolbox.widgetGetLayout(mywindow.findChild("_shipTo"));

  var _portLit = toolbox.createWidget("QLabel", mywindow, "_portLit");
  _portLit.text = qsTr("Port:");
  _portLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _layout.addWidget(_portLit, 0, 2);

  var _port = toolbox.createWidget("XComboBox", mywindow, "_port");
  _port.minimumWidth = 200;
  _port.maximumWidth = 200;
  _port.text = qsTr("Port"); 
  _port.populate("SELECT -1, '' AS port_number "
               + "UNION ALL "
               + "SELECT port_id, (port_number || '-' || port_descrip) "
               + "FROM cgms.port "
               + "ORDER BY port_number;");
  _layout.addWidget(_port, 0, 3);
  
  

  var _layout2  = toolbox.widgetGetLayout(mywindow.findChild("_shipTo"));

  var _terminalLit = toolbox.createWidget("QLabel", mywindow, "_terminalLit");
  _terminalLit.text = qsTr("Terminal:");
  _terminalLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _layout2.addWidget(_terminalLit, 0, 2);

  var _terminal = toolbox.createWidget("XComboBox", mywindow, "_terminal");
  _terminal.text = qsTr("Terminal");
  _layout2.addWidget(_terminal, 0, 3);

  handlePort();
  handleTerminal();
  _port.newID.connect(handlePort);
  _terminal.newID.connect(handleTerminal);

//Nomenclature...
  var _shipDateLit = mywindow.findChild("_shipDateLit");
  _shipDateLit.text = "ETA/Ship Date:";


  mywindow["saved(int)"].connect(save);
  _orderNumber.textChanged.connect(populate);
}
catch (e)
{
  QMessageBox.critical(mywindow, "salesOrder",
                       qsTr("salesOrder.js exception: ") + e);
}

function handlePort()
{
  try
  {
    if (_port.id() == -1)
      return;

    _terminal.populate("SELECT -1, '' AS terminal_number "
                     + "UNION ALL "
                     + "SELECT terminal_id, (terminal_number || '-' || terminal_descrip) "
                     + "FROM cgms.terminal "
                     + "WHERE (terminal_port_id=" + _port.id() + ") "
                     + "ORDER BY terminal_number;");
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("handlePort exception: ") + e);
  }
}

function handleTerminal()
{
  try
  {
    if (_cust.id() == -1 || _terminal.id() == -1)
      return;

    var params = new Object();
    params.terminal_id = _terminal.id();

    var data = toolbox.executeQuery("SELECT * "
                                  + "FROM cgms.terminal JOIN addr ON (addr_id=terminal_addr_id) "
                                  + "WHERE (terminal_id=<? value('terminal_id') ?>);", params);
    if (data.first())
    {
      _shipToName.text = "Terminal Address";
      _shipToAddr.setLine1(data.value("addr_line1"));
      _shipToAddr.setLine2(data.value("addr_line2"));
      _shipToAddr.setLine3(data.value("addr_line3"));
      _shipToAddr.setPostalCode(data.value("addr_postalcode"));
      _shipToAddr.setState(data.value("addr_state"));
      _shipToAddr.setCity(data.value("addr_city"));
      _shipToAddr.setCountry(data.value("addr_country"));
      _shipToCntct.setId(data.value("terminal_cntct_id"));
      params.cust_id = _cust.id();
      params.addr_id=data.value("addr_id");
      var shipto = toolbox.executeQuery("SELECT * "
                                      + "FROM shiptoinfo "
                                      + "WHERE (shipto_addr_id=<? value('addr_id') ?>) "
                                      + "  AND (shipto_cust_id=<? value('cust_id') ?> );", params);
      if (!shipto.first())
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             "Add This Terminal Shipto List");
        params.shipto_name=data.value("terminal_descrip");
        params.shipto_num=data.value("terminal_number");
        params.shipto_cntct_id=data.value("terminal_cntct_id");
        var shiptoadd = toolbox.executeQuery("INSERT INTO shiptoinfo(shipto_cust_id, shipto_name, shipto_num, shipto_addr_id, "
                                           + "            shipto_cntct_id, shipto_commission, shipto_active) "
                                           + "VALUES (<? value('cust_id') ?>, <? value('shipto_name') ?>, "
                                           + "        <? value('shipto_num') ?>, <? value('addr_id') ?>, "
                                           + "        <? value('shipto_cntct_id') ?>, 0.0, true);", params);
        if (shiptoadd.lastError().type != QSqlError.NoError)
        {
          QMessageBox.critical(mywindow, qsTr("Database Error"),
                               shiptoadd.lastError().text);
          return;
        }
      }
      else if (shipto.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             shipto.lastError().text);
        return;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("handleTerminal exception: ") + e);
  }
}

function populate()
{
  try
  {
    var params = new Object();
    params.cohead_number = _orderNumber.text;

    // retrieve soport row
    var data = toolbox.executeDbQuery("soport", "detail", params);
    if (data.first())
    {
      _port.setId(data.value("soport_port_id"));
      _terminal.setId(data.value("soport_terminal_id"));
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrder",
                         qsTr("populate exception: ") + e);
  }
}

function save(pCoheadId)
{
  try
  {
    // save soport row
    _coheadid = pCoheadId;
    var params = new Object();
    params.cohead_id = _coheadid;
    params.port_id = _port.id();
    params.terminal_id = _terminal.id();
    var data = toolbox.executeDbQuery("soport", "update", params);
    if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "soport",
                         qsTr("save exception: ") + e);
  }
}
