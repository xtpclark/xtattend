try
{
  var _number          = mywindow.findChild("_number");
  var _descrip         = mywindow.findChild("_descrip");
  var _costelem        = mywindow.findChild("_costelem");
  var _shipzone          = mywindow.findChild("_shipzone");
  var _terminal        = mywindow.findChild("_terminal");
  var _new             = mywindow.findChild("_new");

  var _edit            = mywindow.findChild("_edit");

  var _view            = mywindow.findChild("_view");

  var _delete          = mywindow.findChild("_delete");

  var _save            = mywindow.findChild("_save");
  var _close           = mywindow.findChild("_close");

  var _portid = -1;
 // PPC Edit - May24 - added checkboxes for bulk, barge, pumpex, drum

  var _pu        = mywindow.findChild("_pu");
  var _dr        = mywindow.findChild("_dr");
  var _bu        = mywindow.findChild("_bu");
  var _ba        = mywindow.findChild("_ba");
// PPC Edit - June 2 - added combobox for Port Stat - Doesnt retreive
  var _stat	= mywindow.findChild("_stat");

  var _mode = '';

  _costelem.populate("SELECT costelem_id, costelem_type"
                    +"  FROM costelem"
                    +" ORDER BY costelem_type;");
  _shipzone.populate("SELECT shipzone_id, (shipzone_name || '-' || shipzone_descrip)"
                  +"  FROM shipzone"
                  +" ORDER BY shipzone_name;");
  _number.setFocus();

  _terminal.addColumn(qsTr("Number"),          -1, Qt.AlignLeft,  true, "terminal_number");
  _terminal.addColumn(qsTr("Description"),     -1, Qt.AlignLeft,  true, "terminal_descrip");


_terminal["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu);

  _new.clicked.connect(sNew);
  _edit.clicked.connect(sEdit);
  _view.clicked.connect(sView);
  _delete.clicked.connect(sDelete);

  _save.clicked.connect(sSave);
  _close.clicked.connect(myclose);
  mydialog.rejected.connect(myclose);
}
catch (e)
{
  QMessageBox.critical(mywindow, "port",
                       "port.js exception: " + e);
}

function set(params)
{
  if ("mode" in params)
    _mode = params.mode;

  if ("port_id" in params)
  {
    _portid = params.port_id;
    sPopulate();
  }

  if (_mode == "view")
  {
    _save.hide();
    _new.hide();
    _edit.hide();
    _delete.hide();
    _number.readOnly = true;
    _descrip.readOnly = true;
    _costelem.readOnly = true;
    _shipzone.readOnly = true;
 // PPC Edit - May24
    _pu.readOnly = true;
    _dr.readOnly = true;
    _bu.readOnly = true;
    _ba.readOnly = true;
    
 // PPC - June 2
    _stat.readOnly = true;
}
}

function sPopulate()
{
  try
  {
    var params = new Object();
    params.port_id = _portid;

    var qry = "SELECT * "
            + "FROM CGMS.port "
            + "WHERE (port_id = <? value('port_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _number.setText(data.value("port_number"));
      _descrip.setText(data.value("port_descrip"));
      _costelem.setId(data.value("port_costelem_id"));
      _shipzone.setId(data.value("port_shipzone_id"));

      _pu.checked = data.value("port_pu");
      _dr.checked = data.value("port_dr");
      _bu.checked = data.value("port_bu");
      _ba.checked = data.value("port_ba");

      _stat.setCurrentIndex = data.value("port_stat");

      sFillList();
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
    QMessageBox.critical(mywindow, "port",
                         "sPopulate exception: " + e);
  }
}

function sSave()
{
  try
  {
    save(true);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "port",
                         "sSave exception: " + e);
  }
}

function save(pCaptive)
{
  try
  {
    if (_mode == "new")
    {
      var qry = "INSERT INTO cgms.port (port_number, port_descrip, "
              + "                       port_costelem_id, port_shipzone_id) "
              + "VALUES (UPPER(<? value('port_number') ?>), "
              + "        <? value('port_descrip') ?>,"
              + "        <? value('port_costelem_id') ?>,"
              + "        <? value('port_shipzone_id') ?>), "
              + "        <? value('port_pu') ?>, "
              + "        <? value('port_dr') ?>, "
              + "        <? value('port_bu') ?>, "
              + "        <? value('port_ba') ?>,  "
	          + "        <? value('port_stat') ?> "
              + "RETURNING port_id;";
    }
 // PPC Edit - May24 ^ ABOVE

    else
    {
      var qry = "UPDATE cgms.port "
              + "SET port_number= UPPER(<? value('port_number') ?>), "
              + "    port_descrip= <? value('port_descrip') ?>,"
              + "    port_costelem_id= <? value('port_costelem_id') ?>,"
              + "    port_shipzone_id= <? value('port_shipzone_id') ?>, "
              + "    port_pu =    <? value('port_pu') ?>, "
              + "    port_dr =    <? value('port_dr') ?>, "
              + "    port_bu =    <? value('port_bu') ?>, "
              + "    port_ba =    <? value('port_ba') ?>, "
              + "    port_stat =  <? value('port_stat') ?> "
              + "WHERE (port_id = <? value('port_id') ?>);";
    }
 // PPC Edit - May24 ^^ABOVE 
    var params = new Object();

    if (setParams(params))
    {
      var data = toolbox.executeQuery(qry, params);

      if (data.first())
      {
        if (_mode == "new")
          _portid = data.value("port_id");
      }
      else if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
        mydialog.reject();
      }
      _mode = "";
      if (pCaptive)
        mydialog.accept();
      else
        _mode = "edit";
    }
    else
      return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "port",
                         "sSave exception: " + e);
  }
}

function setParams(params)
{
  try
  {
    params.port_id = _portid;

    if (_number.text == '')
    {
      QMessageBox.critical(mywindow, "Can Not Save",
                          "Please enter port Number before saving");	
      _number.setFocus();
      return false;
    }
    else
      params.port_number = _number.text;

    if (_descrip.text == '')
    {
      QMessageBox.critical(mywindow, "Can Not Save",
                          "Please enter port Description before saving");	
      _descrip.setFocus();
      return false;
    }
    else
      params.port_descrip = _descrip.text;

    params.port_costelem_id = _costelem.id();
    params.port_shipzone_id = _shipzone.id();
 // PPC Edit - May24
    params.port_pu = _pu.checked;
    params.port_dr = _dr.checked;
    params.port_bu = _bu.checked;
    params.port_ba = _ba.checked;
// PPC June 2
    params.port_stat = _stat.currentText;
    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "port",
                         "setParams(params) exception: " + e);
  }
}

function sFillList()

{

  try

  {
    var params = new Object();

    params.port_id = _portid;

    _terminal.clear();

    var data = toolbox.executeDbQuery("terminal", "detail", params);

    if (data.first())

      _terminal.populate(data, false);

    else if (data.lastError().type != QSqlError.NoError)

    {

      QMessageBox.critical(mywindow, qsTr("Database Error"),

                           data.lastError().text);

      return;

    }

  }

  catch (e)

  {

    QMessageBox.critical(mywindow, "port",

                         qsTr("sFillList exception: ") + e);

  }

}



function populateMenu(pMenu, pItem, pCol)

{

  try

  {

    if (pMenu == null)

      pMenu = _contract.findChild("_menu");

    if (pMenu != null)

    {

      var tmpact = toolbox.menuAddAction(pMenu, qsTr("Edit..."), privileges.check("MaintainRegionPort"));

      tmpact.triggered.connect(sEdit);

                

      tmpact = toolbox.menuAddAction(pMenu, qsTr("View..."), privileges.check("ViewShipzonePort"));

      tmpact.triggered.connect(sView);


      var tmpact = toolbox.menuAddAction(pMenu, qsTr("Delete..."), privileges.check("MaintainRegionPort"));

      tmpact.triggered.connect(sDelete);

    }

  }

  catch (e)

  {

    QMessageBox.critical(mywindow, "port",

                         qsTr("populateMenu(pMenu, pItem, pCol) exception: ") + e);

  }

}



function sNew()

{

  try

  {
    save(false);

    var params = new Object();

    params.port_id = _portid;

    params.mode = "new";

    var newdlg = toolbox.openWindow("terminal", mywindow, 0, 1);

    var tmp = toolbox.lastWindow().set(params);

    var execval = newdlg.exec();
    sFillList();

  }

  catch (e)

  {

    QMessageBox.critical(mywindow, "port",

                         qsTr("sNew exception: ") + e);

  }

}



function sEdit()

{

  try

  {

    var params = new Object();

    params.terminal_id = _terminal.id();

    params.mode = "edit";

    var newdlg = toolbox.openWindow("terminal", mywindow, 0, 1);

    var tmp = toolbox.lastWindow().set(params);

    var execval = newdlg.exec();
    sFillList();

  }

  catch (e)

  {

    QMessageBox.critical(mywindow, "port",

                         qsTr("sEdit exception: ") + e);

  }

}



function sView()

{

  try

  {

    var params = new Object();

    params.terminal_id = _terminal.id();

    params.mode = "view";

    var newdlg = toolbox.openWindow("terminal", mywindow, 0, 1);

    var tmp = toolbox.lastWindow().set(params);

    var execval = newdlg.exec();

  }

  catch (e)

  {

    QMessageBox.critical(mywindow, "port",

                         qsTr("sView exception: ") + e);

  }

}


function sDelete()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("Delete Terminal?"),
                            qsTr("Are you sure you want to delete the selected Terminal?"),
                            QMessageBox.Yes,
                            QMessageBox.No | QMessageBox.Default)
                            == QMessageBox.No)
      return;

    var params = new Object();
    params.terminal_id = _terminal.id();

    var qry = "SELECT cgms.deleteTerminal(<? value('terminal_id') ?>) AS result;";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var result = data.value("result");
      if (result < 0)
      {
        QMessageBox.critical(mywindow,
                             qsTr("Could not Delete Terminal"),
                             storedProcErrorLookup("deleteTerminal", result, cgmsErrors));
        return;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
      throw new Error(data.lastError().text);

    sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "port",
                         "sDelete exception: " + e); 
  }
}

function myclose()
{
  try
  {
    if (_mode == "new")
    {
      if (QMessageBox.question(mywindow, qsTr("Save port?"),
                              qsTr("Are you sure you want to close without saving the new port?"),
                              QMessageBox.Yes,
                              QMessageBox.No | QMessageBox.Default)
                              == QMessageBox.No)
        return;
    }
    mywindow.close();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "port",
                         "myclose exception: " + e);
  }
}
