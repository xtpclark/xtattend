try
{
  var _number          = mywindow.findChild("_number");
  var _descrip         = mywindow.findChild("_descrip");
  var _address         = mywindow.findChild("_address");
  var _contact         = mywindow.findChild("_contact");
  var _save            = mywindow.findChild("_save");
  var _close           = mywindow.findChild("_close");

  var _terminalid = -1;
  var _portid = -1;
  var _mode = '';

  _number.setFocus();
  _save.clicked.connect(save);
  _close.clicked.connect(myclose);
  mydialog.rejected.connect(myclose);
}
catch (e)
{
  QMessageBox.critical(mywindow, "terminal",
                       "terminal.js exception: " + e);
}

function set(params)
{
  if ("mode" in params)
    _mode = params.mode;

  if ("terminal_id" in params)
  {
    _terminalid = params.terminal_id;
    populate();
  }

  if ("port_id" in params)
  {
    _portid = params.port_id;
  }

  if (_mode == "view")
  {
    _save.hide();
    _new.hide();
    _delete.hide();
    _number.readOnly = true;
    _descrip.readOnly = true;
    _address.readOnly = true;
    _contact.readOnly = true;
  }
}

function populate()
{
  try
  {
    var params = new Object();
    params.terminal_id = _terminalid;

    var qry = "SELECT * "
            + "FROM CGMS.terminal "
            + "WHERE (terminal_id = <? value('terminal_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _number.setText(data.value("terminal_number"));
      _descrip.setText(data.value("terminal_descrip"));
      _address.setId(data.value("terminal_addr_id"));
      _contact.setId(data.value("terminal_cntct_id"));
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
    QMessageBox.critical(mywindow, "terminal",
                         "populate exception: " + e);
  }
}

function save()
{
  try
  {
    if (_mode == "new")
    {
      var qry = "INSERT INTO cgms.terminal (terminal_port_id, terminal_number, terminal_descrip,  "
              + "                           terminal_addr_id, terminal_cntct_id) "
              + "VALUES (<? value('terminal_port_id') ?>, "
              + "        UPPER(<? value('terminal_number') ?>), "
              + "        <? value('terminal_descrip') ?>,"
              + "        <? value('terminal_addr_id') ?>,"
              + "        <? value('terminal_cntct_id') ?>);";
    }
    else
    {
      var qry = "UPDATE cgms.terminal "
              + "SET terminal_number= UPPER(<? value('terminal_number') ?>), "
              + "    terminal_descrip= <? value('terminal_descrip') ?>,"
              + "    terminal_addr_id= <? value('terminal_addr_id') ?>,"
              + "    terminal_cntct_id= <? value('terminal_cntct_id') ?> "
              + "WHERE (terminal_id = <? value('terminal_id') ?>);";
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
    QMessageBox.critical(mywindow, "terminal",
                         "save exception: " + e);
  }
}

function setParams(params)
{
  try
  {
    params.terminal_port_id = _portid;
    params.terminal_id = _terminalid;

    if (_number.text == '')
    {
      QMessageBox.critical(mywindow, "Can Not Save",
                          "Please enter Terminal Number before saving");	
      _number.setFocus();
      return false;
    }
    else
      params.terminal_number = _number.text;

    if (_descrip.text == '')
    {
      QMessageBox.critical(mywindow, "Can Not Save",
                          "Please enter Terminal Description before saving");	
      _descrip.setFocus();
      return false;
    }
    else
      params.terminal_descrip = _descrip.text;

    params.terminal_addr_id = _address.id();
    params.terminal_cntct_id = _contact.id();

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "terminal",
                         "setParams(params) exception: " + e);
  }
}

function myclose()
{
  try
  {
    if (_mode == "new")
    {
      if (QMessageBox.question(mywindow, qsTr("Save Terminal?"),
                              qsTr("Are you sure you want to close without saving the new Terminal?"),
                              QMessageBox.Yes,
                              QMessageBox.No | QMessageBox.Default)
                              == QMessageBox.No)
        return;
    }
    mywindow.close();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "terminal",
                         "myclose exception: " + e);
  }
}