debugger;
try
{
  var _item = mywindow.findChild("_item");
  var _warehouse = mywindow.findChild("_warehouse");
  var _poNumber = mywindow.findChild("_poNumber");
  var _unitPrice = mywindow.findChild("_unitPrice");
  var _listPrices = mywindow.findChild("_listPrices");
  var _vendorItemNumberList = mywindow.findChild("_vendorItemNumberList");
  var _vendid = -1;
  var _portid = -1;
  var _useContract = false;

  _item.newId.connect(usesContract);
  _unitPrice.valueChanged.connect(sDeterminePrice);
  toolbox.coreDisconnect(_listPrices, "clicked()", mywindow, "sVendorListPrices()");
  _listPrices.clicked.connect(listPrices);
  toolbox.coreDisconnect(_vendorItemNumberList, "clicked()", mywindow, "sVendorItemNumberList()");
  _vendorItemNumberList.clicked.connect(itemNumberList);
}
catch (e)
{
  QMessageBox.critical(mywindow, "purchaseOrderItem",
                       qsTr("purchaseOrderItem.js exception: ") + e);
}

function usesContract()
{
  try
  {
    if (!_item.isValid())
      return false;

    var params = new Object();
    params.item_id = _item.id();

    var data = toolbox.executeQuery("SELECT itemcontract_uses_contract "
                                  + "FROM cgms.itemcontract "
                                  + "WHERE (itemcontract_item_id=<? value('item_id') ?>);", params);
    if (data.first())
    {
      if (data.value("itemcontract_uses_contract"))
      {
        _useContract = true;
        getPoheadInfo();
        return true;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
    }

    _useContract = false;
    return false;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "purchaseOrderitem",
                         qsTr("usesContract exception: ") + e);
  }
}

function getPoheadInfo()
{
  try
  {
    var params = new Object();
    params.pohead_number = _poNumber.text;

    var data = toolbox.executeQuery("SELECT pohead_vend_id, poport_port_id "
                                  + "FROM pohead LEFT OUTER JOIN cgms.poport ON (poport_pohead_id=pohead_id) "
                                  + "WHERE (pohead_number=<? value('pohead_number') ?>);", params);
    if (data.first())
    {
      _vendid = data.value("pohead_vend_id");
      _portid = data.value("poport_port_id");
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
    QMessageBox.critical(mywindow, "purchaseOrderitem",
                         qsTr("getPoheadInfo exception: ") + e);
  }
}

function sDeterminePrice()
{
  try
  {
    if (!_useContract)
      return;

    var params = new Object();
    params.item_id = _item.id();
    params.warehous_id = _warehouse.id();
    params.vend_id = _vendid;
    params.port_id = _portid;

    var data = toolbox.executeQuery("SELECT cgms.contractPurchasePrice(<? value('item_id') ?>, "
                                  + "                                  <? value('warehous_id') ?>, "
                                  + "                                  <? value('vend_id') ?>, "
                                  + "                                  <? value('port_id') ?>) "
                                  + "AS unitPrice;", params);
    if (data.first())
    {
      _unitPrice.valueChanged.disconnect(sDeterminePrice);
      _unitPrice.setLocalValue(data.value("unitPrice"));
      _unitPrice.valueChanged.connect(sDeterminePrice);
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
    QMessageBox.critical(mywindow, "purchaseOrderItem",
                         qsTr("sDeterminePrice exception: ") + e);
  }
}

function listPrices()
{
  try
  {
    if (!_useContract)
    {
      mywindow.sVendorListPrices();
      return;
    }

    var params = new Object;
    params.target_type = "V";
    params.target_id = _vendid;
    params.item_id = _item.id();
    params.warehous_id = _warehouse.id();
    params.port_id = _portid;
    var wnd = toolbox.openWindow("contractPriceList", mywindow, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    wnd.exec();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "purchaseOrderItem",
                         qsTr("listPrices exception: ") + e);
  }
}

function itemNumberList()
{
  try
  {
    if (!_useContract)
    {
      mywindow.sVendorItemNumberList();
      return;
    }

    var params = new Object;
    params.target_type = "V";
    params.target_id = _vendid;
    params.item_id = _item.id();
    params.warehous_id = _warehouse.id();
    params.port_id = _portid;
    var wnd = toolbox.openWindow("contractPriceList", mywindow, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    wnd.exec();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "purchaseOrderItem",
                         qsTr("itemNumberList exception: ") + e);
  }
}

