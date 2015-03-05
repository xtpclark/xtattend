debugger;

try
{
  var _item            = mywindow.findChild("_item");
  var _site            = mywindow.findChild("_site");
  var _port            = mywindow.findChild("_port");
  var _curr            = mywindow.findChild("_curr");
  var _marketIndex     = mywindow.findChild("_marketIndex");
  var _pricingSchedule = mywindow.findChild("_pricingSchedule");
  var _fixedPrice      = mywindow.findChild("_fixedPrice");
  var _costelem        = mywindow.findChild("_costelem");
  var _pctMarkup       = mywindow.findChild("_pctMarkup");
  var _costelemLit     = mywindow.findChild("_costelemLit");
  var _pctMarkupLit    = mywindow.findChild("_pctMarkupLit");

  _pctMarkup.setValidator(mainwindow.percentVal());
  var _save            = mywindow.findChild("_save");
  var _close           = mywindow.findChild("_close");

  var _contractItemId = -1;
  var _contractId = -1;
  var _mode = '';

  handleSite();
  handlePricingType();
  _site.newID.connect(handleSite);
  _marketIndex.clicked.connect(handlePricingType);
  _pricingSchedule.clicked.connect(handlePricingType);
  _fixedPrice.clicked.connect(handlePricingType);
  _save.clicked.connect(save);
  _close.clicked.connect(myclose);
  mydialog.rejected.connect(myclose);
}
catch (e)
{
  QMessageBox.critical(mywindow, "contractitem",
                       "contractitem.js exception: " + e);
}

function set(params)
{
  if ("mode" in params)
    _mode = params.mode;

  if ("contractitem_id" in params)
  {
    _contractItemId = params.contractitem_id;
    populate();
  }

  if ("contract_id" in params)
  {
    _contractId = params.contract_id;
  }

  if ("item_id" in params)
  {
    _item.setId(params.item_id);
  }

  if (_mode == "view")
  {
    _save.hide();
    _item.readOnly = true;
    _site.readOnly = true;
    _port.readOnly = true;
    _costelem.readOnly = true;
    _curr.readOnly = true;
    _pctMarkup.readOnly = true;
  }
}

function handleSite()
{
  try
  {
    _port.populate("SELECT port_id, (port_number || '-' || port_descrip) "
                  +"FROM xtattend.siteport JOIN xtattend.port ON (port_id=siteport_port_id) "
                  +"WHERE (siteport_site_id=" + _site.id() + ") "
                  +"ORDER BY port_number;");
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contractitem",
                         "populate exception: " + e);
  }
}

function handlePricingType()
{
  try
  {
    if (_marketIndex.checked)
    {
      _costelemLit.text = "Market Index";
      _pctMarkupLit.text = "Percent Markup";
      _costelem.populate("SELECT costelem_id, costelem_type"
                        +"  FROM costelem"
                        +" ORDER BY costelem_type;");
    }
    else if (_pricingSchedule.checked)
    {
      _costelemLit.text = "Pricing Schedule";
      _pctMarkupLit.text = "Percent Discount";
      _costelem.populate("SELECT ipshead_id, ipshead_name"
                        +"  FROM ipshead"
                        +" ORDER BY ipshead_name;");
    }
    else if (_fixedPrice.checked)
    {
      _costelemLit.text = "N/A";
      _pctMarkupLit.text = "Price";
      _costelem.clear();
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contractitem",
                         "populate exception: " + e);
  }
}

function populate()
{
  try
  {
    var params = new Object();
    params.contractitem_id = _contractItemId;

    var qry = "SELECT * "
            + "FROM CGMS.contractitem "
            + "WHERE (contractitem_id = <? value('contractitem_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _item.setId(data.value("contractitem_item_id"));
      _site.setId(data.value("contractitem_site_id"));
      handleSite();
      _port.setId(data.value("contractitem_port_id"));
      _curr.setId(data.value("contractitem_curr_id"));
      if (data.value("contractitem_pricing_type") == "M")
        _marketIndex.setChecked(true);
      else if (data.value("contractitem_pricing_type") == "P")
        _pricingSchedule.setChecked(true);
      else if (data.value("contractitem_pricing_type") == "F")
        _fixedPrice.setChecked(true);
      handlePricingType();
      _costelem.setId(data.value("contractitem_costelem_id"));
      if (_fixedPrice.checked)
        _pctMarkup.setDouble(data.value("contractitem_pctmarkup"));
      else
        _pctMarkup.setDouble(data.value("contractitem_pctmarkup") * 100.0);
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
    QMessageBox.critical(mywindow, "contractitem",
                         "populate exception: " + e);
  }
}

function save()
{
  try
  {
    if (_mode == "new")
    {
      var qry = "INSERT INTO xtattend.contractitem (contractitem_contract_id, contractitem_item_id, contractitem_site_id, "
              + "                               contractitem_port_id, contractitem_pricing_type, contractitem_costelem_id, "
              + "                               contractitem_pctmarkup, contractitem_curr_id) "
              + "VALUES (<? value('contractitem_contract_id') ?>,"
              + "        <? value('contractitem_item_id') ?>,"
              + "        <? value('contractitem_site_id') ?>,"
              + "        <? value('contractitem_port_id') ?>,"
              + "        <? value('contractitem_pricing_type') ?>,"
              + "        <? value('contractitem_costelem_id') ?>,"
              + "        <? value('contractitem_pctmarkup') ?>,"
              + "        <? value('contractitem_curr_id') ?>);";
    }
    else
    {
      var qry = "UPDATE xtattend.contractitem "
              + "SET contractitem_item_id = <? value('contractitem_item_id') ?>,"
              + "    contractitem_site_id = <? value('contractitem_site_id') ?>,"
              + "    contractitem_port_id = <? value('contractitem_port_id') ?>,"
              + "    contractitem_pricing_type = <? value('contractitem_pricing_type') ?>,"
              + "    contractitem_costelem_id = <? value('contractitem_costelem_id') ?>,"
              + "    contractitem_pctmarkup = <? value('contractitem_pctmarkup') ?>,"
              + "    contractitem_curr_id = <? value('contractitem_curr_id') ?> "
              + "WHERE (contractitem_id = <? value('contractitem_id') ?>);";
    }
 
    var params = new Object();

    if (setParams(params))
    {
      var data = toolbox.executeQuery(qry, params);

      if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
        mydialog.reject();
      }
      _mode = "";
      mydialog.accept();
    }
    else
      return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contractitem",
                         "save exception: " + e);
  }
}

function setParams(params)
{
  try
  {
    params.contractitem_id = _contractItemId;
    params.contractitem_contract_id = _contractId;

    if (!_item.isValid())
    {
      QMessageBox.critical(mywindow, "Can Not Save",
                          "Please select Item before saving");	
      _item.setFocus();
      return false;
    }
    else
      params.contractitem_item_id = _item.id();

    if (!_site.isValid())
    {
      QMessageBox.critical(mywindow, "Can Not Save",
                          "Please select Site before saving");	
      _site.setFocus();
      return false;
    }
    else
      params.contractitem_site_id = _site.id();

    if (!_port.isValid())
    {
      QMessageBox.critical(mywindow, "Can Not Save",
                          "Please select Port before saving");	
      _port.setFocus();
      return false;
    }
    else
      params.contractitem_port_id = _port.id();

    if (_marketIndex.checked)
      params.contractitem_pricing_type = "M";
    else if (_pricingSchedule.checked)
      params.contractitem_pricing_type = "P";
    else if (_fixedPrice.checked)
      params.contractitem_pricing_type = "F";

    params.contractitem_costelem_id = _costelem.id();
    if (_fixedPrice.checked)
      params.contractitem_pctmarkup = _pctMarkup.toDouble();
    else
      params.contractitem_pctmarkup = _pctMarkup.toDouble() / 100.0;
    params.contractitem_curr_id = _curr.id();

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contractitem",
                         "setParams(params) exception: " + e);
  }
}

function myclose()
{
  try
  {
    if (_mode == "new")
    {
      if (QMessageBox.question(mywindow, qsTr("Save Contract Item?"),
                              qsTr("Are you sure you want to close without saving the new Contract Item?"),
                              QMessageBox.Yes,
                              QMessageBox.No | QMessageBox.Default)
                              == QMessageBox.No)
        return;
    }
    mywindow.close();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contractitem",
                         "myclose exception: " + e);
  }
}