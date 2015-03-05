debugger;

try
{
  var _targettype;
  var _targetid;
  var _item            = mywindow.findChild("_item");
  var _site            = mywindow.findChild("_site");
  var _port            = mywindow.findChild("_port");
  var _contract        = mywindow.findChild("_contract");
  var _select          = mywindow.findChild("_select");
  var _close           = mywindow.findChild("_close");

  _contract.addColumn(qsTr("Number"),        -1, Qt.AlignLeft,  true, "contract_number");
  _contract.addColumn(qsTr("Type"),          -1, Qt.AlignLeft,  true, "f_targettype");
  _contract.addColumn(qsTr("Target"),        -1, Qt.AlignLeft,  true, "f_target");
  _contract.addColumn(qsTr("Effective"),     -1, Qt.AlignCenter,true, "contract_effective");
  _contract.addColumn(qsTr("Expires"),       -1, Qt.AlignCenter,true, "contract_expires");
  _contract.addColumn(qsTr("Item"),          -1, Qt.AlignLeft,  true, "item_number");
  _contract.addColumn(qsTr("Site"),          -1, Qt.AlignLeft,  true, "warehous_code");
  _contract.addColumn(qsTr("Port"),          -1, Qt.AlignLeft,  true, "port_number");
  _contract.addColumn(qsTr("Pricing Type"),  -1, Qt.AlignLeft,  true, "f_pricingtype");
  _contract.addColumn(qsTr("Index"),         -1, Qt.AlignLeft,  true, "f_index");
  _contract.addColumn(qsTr("Price"),         -1, Qt.AlignRig,   true, "contractitem_pctmarkup");

  _port.populate("SELECT port_id, (port_number || '-' || port_descrip)"
                +"  FROM xtattend.port"
                +" ORDER BY port_number;");
  _select.clicked.connect(select);
  _close.clicked.connect(myclose);
}
catch (e)
{
  QMessageBox.critical(mywindow, "contractPriceList",
                       "contractPriceList.js exception: " + e);
}

function set(params)
{
  try
  {
    if ("target_type" in params)
      _targettype = params.target_type;

    if ("target_id" in params)
      _targetid = params.target_id;

    if ("item_id" in params)
      _item.setId(params.item_id);

    if ("warehous_id" in params)
      _site.setId(params.warehous_id);

    if ("port_id" in params)
      _port.setId(params.port_id);

    populate();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contractPriceList",
                         "set exception: " + e);
  }
}

function populate()
{
  try
  {
    var params = new Object();
    params.customer         = qsTr("Customer");
    params.vendor           = qsTr("Vendor");
    params.marketindex      = qsTr("Market Index");
    params.pricingschedule  = qsTr("Pricing Schedule");
    params.fixed            = qsTr("Fixed Price");
    params.target_type = _targettype;
    params.target_id = _targetid;
    params.item_id = _item.id();
    params.warehous_id = _site.id();
    params.port_id = _port.id();

    _contract.clear();
    var data = toolbox.executeDbQuery("contract", "detail", params);
    if (data.first())
    {
      _contract.populate(data, true);
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
    QMessageBox.critical(mywindow, "contractPriceList",
                         "populate exception: " + e);
  }
}

function select()
{
  try
  {
    return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contractPriceList",
                         "select exception: " + e);
  }
}

function myclose()
{
  try
  {
    mywindow.close();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contractPriceList",
                         "myclose exception: " + e);
  }
}