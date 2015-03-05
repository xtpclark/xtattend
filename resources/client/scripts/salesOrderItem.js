debugger;
try
{
  var _item = mywindow.findChild("_item");
  var _warehouse = mywindow.findChild("_warehouse");
  var _orderNumber = mywindow.findChild("_orderNumber");
  var _netUnitPrice = mywindow.findChild("_netUnitPrice");
  var _listPrices = mywindow.findChild("_listPrices");
  var _qtyOrdered = mywindow.findChild("_qtyOrdered");
  var _custid = -1;
  var _portid = -1;
  var _contractbom = null;
  var _useContract = false;

  var _tabs = mywindow.findChild("_tabs");
  var _supplyTab = mywindow.findChild("supplyTab");
  var _tabindex = toolbox.tabTabIndex(_tabs,_supplyTab);

  _item.newId.connect(fillList);
  _warehouse.newID.connect(fillList);
  _netUnitPrice.valueChanged.connect(sDeterminePrice);
  toolbox.coreDisconnect(_listPrices, "clicked()", mywindow, "sListPrices()");
  _listPrices.clicked.connect(listPrices);
}
catch (e)
{
  QMessageBox.critical(mywindow, "salesOrderItem",
                       qsTr("salesOrderItem.js exception: ") + e);
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
        var _contractbomTab = toolbox.loadUi("contractCostedBOM", mywindow);
        _contractbom = _contractbomTab.findChild("_contractbom");
        var _siteLit = _contractbomTab.findChild("_siteLit");
        var _portLit = _contractbomTab.findChild("_portLit");
        var _site = _contractbomTab.findChild("_site");
        var _port = _contractbomTab.findChild("_port");
        _siteLit.hide();
        _portLit.hide();
        _site.hide();
        _port.hide();

        _contractbom.addColumn(qsTr("Site"),          -1, Qt.AlignLeft,  true, "site");
        _contractbom.addColumn(qsTr("Vendor"),        -1, Qt.AlignLeft,  true, "vendor");
        _contractbom.addColumn(qsTr("Item"),          -1, Qt.AlignLeft,  true, "item");
        _contractbom.addColumn(qsTr("Component"),     -1, Qt.AlignLeft,  true, "component_item");
        _contractbom.addColumn(qsTr("Index"),         -1, Qt.AlignLeft,  true, "indx");
        _contractbom.addColumn(qsTr("Index Base"),    -1, Qt.AlignLeft,  true, "indx_base");
        _contractbom.addColumn(qsTr("Pct. Markup"),   -1, Qt.AlignRigt,  true, "markup");
        _contractbom.addColumn(qsTr("Cost"),          -1, Qt.AlignRight, true, "cost");

//        toolbox.tabRemoveTab(_tabs, _tabindex, _supplyTab);
        toolbox.tabInsertTab(_tabs, _tabindex, _contractbomTab, qsTr("Contract Bill of Materials"));
        _tabs.setCurrentIndex(0);

        getCoheadInfo();
        return true;
      }
      else
      {
        toolbox.tabRemoveTab(_tabs, _tabindex, _contractbomTab);
//        toolbox.tabInsertTab(_tabs, _tabindex, _supplyTab, qsTr("Supply"));
        _tabs.setCurrentIndex(0);
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
    }
    else
    {
      toolbox.tabRemoveTab(_tabs, _tabindex, _contractbomTab);
      toolbox.tabInsertTab(_tabs, _tabindex, _supplyTab, qsTr("Supply"));
      _tabs.setCurrentIndex(0);
    }

    return false;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderitem",
                         qsTr("usesContract exception: ") + e);
  }
}

function getCoheadInfo()
{
  try
  {
    var params = new Object();
    params.cohead_number = _orderNumber.text;

    var data = toolbox.executeQuery("SELECT cohead_cust_id, soport_port_id "
                                  + "FROM cohead LEFT OUTER JOIN cgms.soport ON (soport_cohead_id=cohead_id) "
                                  + "WHERE (cohead_number=<? value('cohead_number') ?>);", params);
    if (data.first())
    {
      _custid = data.value("cohead_cust_id");
      _portid = data.value("soport_port_id");
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
    QMessageBox.critical(mywindow, "salesOrderitem",
                         qsTr("getCoheadInfo exception: ") + e);
  }
}

function fillList()
{
  try
  {
    if (!_item.isValid() || !_warehouse.isValid())
      return;

    if (!usesContract())
    {
      return;
      _useContract = false;
    }

    _useContract = true;
    var params = new Object();
    params.item_id = _item.id();
    params.warehous_id = _warehouse.id();
    params.port_id = _portid;

    _contractbom.clear();
    var data = toolbox.executeDbQuery("contract", "costedbom", params);
    if (data.first())
      _contractbom.populate(data, true);
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("fillList exception: ") + e);
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
    params.cust_id = _custid;
    params.port_id = _portid;
    params.qtyOrdered = _qtyOrdered.toDouble();

    var data = toolbox.executeQuery("SELECT cgms.contractSalesPrice(<? value('item_id') ?>, "
                                  + "                               <? value('warehous_id') ?>, "
                                  + "                               <? value('cust_id') ?>, "
                                  + "                               <? value('port_id') ?>, "
                                  + "                               <? value('qtyOrdered') ?>) "
                                  + "AS netUnitPrice;", params);
    if (data.first())
    {
      _netUnitPrice.valueChanged.disconnect(sDeterminePrice);
      _netUnitPrice.setLocalValue(data.value("netUnitPrice"));
      _netUnitPrice.valueChanged.connect(sDeterminePrice);
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
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("sDeterminePrice exception: ") + e);
  }
}

function listPrices()
{
  try
  {
    if (!_useContract)
    {
      mywindow.sListPrices();
      return;
    }

    var params = new Object;
    params.target_type = "C";
    params.target_id = _custid;
    params.item_id = _item.id();
    params.warehous_id = _warehouse.id();
    params.port_id = _portid;
    var wnd = toolbox.openWindow("contractPriceList", mywindow, Qt.NonModal, Qt.Dialog);
    toolbox.lastWindow().set(params);
    wnd.exec();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "salesOrderItem",
                         qsTr("listPrices exception: ") + e);
  }
}

