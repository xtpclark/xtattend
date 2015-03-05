debugger;
try
{
  var _poheadid = -1;

  var _orderNumber = mywindow.findChild("_orderNumber");
  var _shipToAddr = mywindow.findChild("_shiptoAddr");
  var _shipToCntct = mywindow.findChild("_shiptoCntct");
  var _lineItemsPage = mywindow.findChild("_lineItemsPage");
  var _new = _lineItemsPage.findChild("_new");

//  var _layout  = toolbox.widgetGetLayout(mywindow.findChild("_vendor"));
  var _layout  = toolbox.widgetGetLayout(mywindow.findChild("_dropShip"));

  var _portLit = toolbox.createWidget("QLabel", mywindow, "_portLit");
  _portLit.text = qsTr("Port:");
  _portLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _layout.addWidget(_portLit, 4, 2);

  var _port = toolbox.createWidget("XComboBox", mywindow, "_port");
  _port.minimumWidth = 200;
  _port.maximumWidth = 200;
  _port.text = qsTr("Port");
  _port.populate("SELECT port_id, (port_number || '-' || port_descrip) "
               + "FROM cgms.port "
               + "ORDER BY port_number;");
  _layout.addWidget(_port, 0, 3);

  var _layout2  = toolbox.widgetGetLayout(mywindow.findChild("_dropShip"));

  var _terminalLit = toolbox.createWidget("QLabel", mywindow, "_terminalLit");
  _terminalLit.text = qsTr("Terminal:");
  _terminalLit.alignment = 130; // Qt::AlignRight(2) + Qt::AlignVCenter (128)
  _layout2.addWidget(_terminalLit, 0, 2);

  var _terminal = toolbox.createWidget("XComboBox", mywindow, "_terminal");
  _terminal.text = qsTr("Terminal");
  _layout2.addWidget(_terminal, 1, 3);

  handlePort();
  handleTerminal();
  _port.newID.connect(handlePort);
  _terminal.newID.connect(handleTerminal);

  mywindow["saved(int)"].connect(save);
  _orderNumber.textChanged.connect(populate);
  _new.clicked.connect(newPoitem);
  toolbox.coreDisconnect(_new, "clicked()", mywindow, "sNew()");
}
catch (e)
{
  QMessageBox.critical(mywindow, "purchaseOrder",
                       qsTr("purchaseOrder.js exception: ") + e);
}

function handlePort()
{
  try
  {
    _terminal.populate("SELECT terminal_id, (terminal_number || '-' || terminal_descrip) "
                     + "FROM cgms.terminal "
                     + "WHERE (terminal_port_id=" + _port.id() + ") "
                     + "ORDER BY terminal_number;");
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "purchaseOrder",
                         qsTr("handlePort exception: ") + e);
  }
}

function handleTerminal()
{
  try
  {
    var params = new Object();
    params.terminal_id = _terminal.id();

    var data = toolbox.executeQuery("SELECT * "
                                  + "FROM cgms.terminal LEFT OUTER JOIN addr ON (addr_id=terminal_addr_id) "
                                  + "WHERE (terminal_id=<? value('terminal_id') ?>);", params);
    if (data.first())
    {
      _shipToAddr.setLine1(data.value("addr_line1"));
      _shipToAddr.setLine2(data.value("addr_line2"));
      _shipToAddr.setLine3(data.value("addr_line3"));
      _shipToAddr.setPostalCode(data.value("addr_postalcode"));
      _shipToAddr.setState(data.value("addr_state"));
      _shipToAddr.setCity(data.value("addr_city"));
      _shipToAddr.setCountry(data.value("addr_country"));
      _shipToCntct.setId(data.value("terminal_cntct_id"));
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
    QMessageBox.critical(mywindow, "purchaseOrder",
                         qsTr("handleTerminal exception: ") + e);
  }
}

function newPoitem()
{
  try
  {
    var params = new Object();
    params.pohead_number = _orderNumber.text;

    var data = toolbox.executeQuery("SELECT pohead_id FROM pohead WHERE pohead_number=<? value('pohead_number') ?>", params);
    if (data.first())
    {
      _poheadid = data.value("pohead_id");
      save(_poheadid);
      mywindow.sNew();
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
    QMessageBox.critical(mywindow, "purchaseOrder",
                         qsTr("newPoitem exception: ") + e);
  }
}

function populate()
{
  try
  {
    var params = new Object();
    params.pohead_number = _orderNumber.text;

    // retrieve poport row
    var data = toolbox.executeDbQuery("poport", "detail", params);
    if (data.first())
    {
      _port.setId(data.value("poport_port_id"));
      _terminal.setId(data.value("poport_terminal_id"));
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
    QMessageBox.critical(mywindow, "purchaseOrder",
                         qsTr("populate exception: ") + e);
  }
}

function save(pPoheadId)
{
  try
  {
    // save poport row
    _poheadid = pPoheadId;
    var params = new Object();
    params.pohead_id = _poheadid;
    params.port_id = _port.id();
    params.terminal_id = _terminal.id();
    var data = toolbox.executeDbQuery("poport", "update", params);
    if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "poport",
                         qsTr("save exception: ") + e);
  }
}
