      require([
              "dojo/dom",
              "dojo/_base/xhr",
              "dojo/parser",
              "dojox/grid/DataGrid",
              "dojo/store/JsonRest",
              "dojox/data/JsonRestStore",
              "dojo/data/ObjectStore",
              "dojo/on",
              "dijit/registry",
              "dijit/Dialog",
              "dojo/ready",
              "dojo/_base/array",
              "dojo/dom-construct",
              "dojo/dom-style",
              "dojox/layout/ContentPane", 
              "dojo/behavior",
              "dojo/store/Memory",
              "dojo/dom-geometry",

              "dojo/_base/connect",
              "dojo/on",
              "dijit/TitlePane",
              "dijit/layout/TabContainer", 
              "dijit/layout/BorderContainer",
              "dijit/layout/SplitContainer",
              "dijit/form/Form",
              "dijit/form/Button",
              "dijit/form/TextBox", 		         
              "dijit/form/ValidationTextBox", 
              "dijit/form/Textarea",
              "dijit/form/SimpleTextarea",
              "dijit/form/DateTextBox",
              "dijit/form/TimeTextBox",
              "dijit/form/NumberTextBox",
              "dijit/form/Select",
              "dijit/form/MultiSelect",
              "dijit/form/FilteringSelect",
              "dojox/form/Manager", 
              "dojox/validate/web",
              "dijit/Menu",
              "dijit/Tooltip",
              "dijit/MenuBar",
              "dijit/PopupMenuBarItem",
              "dijit/DropDownMenu",
              "dijit/MenuItem",
              "dojo/data/ItemFileWriteStore",
              "dojox/data/QueryReadStore",
              "dijit/Tree",
              "dojo/store/Observable",

              "dojo/domReady!"
      ], 
      function(dom, xhr, parser      , DataGrid, 
               JsonRest, JsonRestStore, ObjectStore , on, 
               registry, Dialog      , ready, 
               array   , domConstruct, 
               domStyle, ContentPane,
               behaviour, Memory, domGeom
               )
        {
        // Define Variables to be used later in the app..

        // STORES;
        var myStore;
        var phoneStore;
        var contactStore;
        var guardianStore;
        var admissionStore;
        var visitStore;

       // Define Behaviours for the Application.
       genericFormBehaviour = function(){
        var FormBehaviour = {
             "#id_patient_detail":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "label[for=id_patient_detail]":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "#id_admission_detail":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "label[for=id_admission_detail]":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "#id_visit_detail":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "label[for=id_visit_detail]":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "#id_phy_exam_detail":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "label[for=id_phy_exam_detail]":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
            "#id_consult_nature":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "label[for=id_consult_nature]":{
                found:   function(el){ domStyle.set(el, 'display','none')}
             },
             "span[class= helptext]":{
                found:   function(el){ 
                                   domStyle.set(el, 'font-size','8px');
                                   domStyle.set(el, 'color','RoyalBlue');
                                   domStyle.set(el, 'font-style','italic');
                         }
             }
         }
          behaviour.add(FormBehaviour)
          behaviour.apply()
       }

//        var grid;
//        var admissionGrid;
//        var visitGrid;
//        var contactGrid;
//        var phoneGrid;
//        var guardianGrid;

       // Define Methods for cleaning up after use.
        var doPostDelCleanup;

      //Define Admission Trees
        var admissionTree;
        var admissionTreeStore;
        var admissionTreeModel;

       // Define Global URL variables
        var AdmissionPhyExamAddFormUrl;

       // Define Events:

       // Define Generic PopUpDialog Widgets
        var jsonMessageDialog = new dijit.Dialog({ title   : "Login", 
                                                    style   : "color: black; text-align: center;",
                                                  }, 
                                         "dialogJsonMessage");
        jsonMessageDialog.startup();

        var loginDialog = new dijit.Dialog({ title        : "Login", 
                                         style             : "width: 500px; height:500px; background:white;",
                                         href              : '/AuShadha/login/',
                                         onClose           : function(){ return false;},
                                         doSetUpAndStartUp : function(){
                                                   this.closeButtonNode.style.display ='none';
                                                   this._onKey = function(evt){
                                                                  key = evt.keyCode;
                                                                  if(key == dojo.keys.ESCAPE){
                                                                    dojo.stopEvent(evt)
                                                                  }
                                                                 }
                                                   this.startup();
                                                 }
                                         }, 
                                         "loginDialog");
        loginDialog.doSetUpAndStartUp();
//   {% if not user.is_authenticated %}
        loginDialog.show();
//   {% else %}
        var patientDialog = new dijit.Dialog({ title : "Add Patient", 
                                                style : "width: 500px; height:350px; background:white;"
                                         }, 
                                         "editPatientDialog");
        patientDialog.startup();


        // Define Various Stores
        phoneStore    = new JsonRest({target: ""});
        contactStore  = new JsonRest({target:""});
        guardianStore = new JsonRest({target:""});

        complaintsStore = new Memory({data:COMPLAINTS});
        console.log(complaintsStore)

        complaintDurationsStore = new Memory({data:COMPLAINT_DURATIONS});
        console.log(complaintDurationsStore)


        myStore = new JsonRest({target:"/AuShadha/pat/list/", idProperty: 'id'});
        grid    = new DataGrid({
                  store         : dataStore = ObjectStore({objectStore: myStore}),
                  query         : { search_field: 'id', search_for: "*" },
                  clientSort    : true,
                  autoWidth     : true,
                  selectionMode : "single",
                  rowSelector   : "20px",
                  structure: [
                  {name       : "ID", 
                  field      : "id", 
                  width      : "50px",
                  hidden     : true,
                  cellStyles : "text-align:center;"
                  },
                  {name       : "Edit", 
                  field      : "edit", 
                  width      : "50px",
                  hidden     : true,
                  cellStyles : "text-align:center;"
                  },
                  {name       : "Del", 
                  field      : "del", 
                  width      : "50px",
                  hidden     : true,
                  cellStyles : "text-align:center;"
                  },
                  {name       : "Visit", 
                  field      : "visitadd", 
                  width      : "50px",
                  hidden     : true,
                  cellStyles : "text-align:center;"
                  },
                  {name       : "Adm", 
                    field      : "admissionadd", 
                    width      : "50px",
                    hidden     : true,
                    cellStyles : "text-align:center;"
                  },

                  {name       : "Patient ID", 
                    field      : "patient_hospital_id", 
                    width      : "100px",
                    cellStyles : "text-align:center;"
                  },
                  { name      : "First Name", 
                    field     : "first_name", 
                    width      : "100px",
                    cellStyles : "text-align:center;"
                  },
                  { name      : "Middle Name", 
                    field     : "middle_name", 
                    width      : "100px",
                    cellStyles : "text-align:center;"
                  },
                  { name       : "Last Name" ,
                    field      : "last_name" , 
                    width      : "100px",
                    cellStyles : "text-align:center;",
                    formatter  : function(last_name){ 
                                  return '<em>'+ last_name +'</em>';
                               }
                  },
                  { name        : "Full Name", 
                    field       : "full_name", 
                    width       : "100px",
                    hidden      : true,
                    cellStyles  : "text-align:center;"
                  },
                  {name       : "Age"   ,
                    field      : "age"   ,
                    width      : "100px",
                    cellStyles : "text-align:center;"
                  },
                  {name      : "Sex" , 
                    field     : "sex" ,
                    width      : "100px",
                    formatter : function(sex){
                              if(sex == 'Male'){
                               return '<img src="{{STATIC_URL}}images/male.png" '+
                                       'alt="Male" class="small_img">'; 
                              }
                              else if(sex == 'Female'){
                               return '<img '+
                                      'src="{{STATIC_URL}}images/female.png"'+
                                      'title="'+ sex +
                                      '" alt="Male" class="small_img">'; 
                              }
                              else{
                               return "Others"
                              } 
                            },
                    cellStyles: "text-align:center;"
                  },
                  { name      : "URL"   , 
                    field     : "home"  ,
                    width      : "50px",
                    hidden    : true,
                    cellStyles: "text-align:center;",
                  },
        ],
        noDataMessage: "<span class='dojoxGridNoData'>No Matching Patients</span>"
    }, 
    "patient_grid"
  ); 

  grid.startup();
  grid.canSort = function(){ return true;};

  grid.onRowClick = function(e) { 
                        var idx    = e.rowIndex,
                            item   = this.getItem(idx),
                            patid  = this.store.getValue(item, "id");

                        grid.selection.clear();
                        grid.selection.setSelected(item, true);

                        var contactUrl  = "{%url contact_json %}" + 
                                           "?patient_id=" 
                                           + patid,
                            phoneUrl    = "{%url phone_json %}" + 
                                          "?patient_id=" 
                                          + patid,
                            guardianUrl = "{%url guardian_json %}" + 
                                          "?patient_id=" 
                                          + patid,
                            admissionUrl = "{%url admission_json %}" + 
                                           "?patient_id=" 
                                           + patid,
                            visitUrl     = "{%url visit_json %}" + 
                                           "?patient_id=" 
                                           + patid;
                      var contactStore     = new JsonRest({target:contactUrl}),
                           phoneStore      = new JsonRest({target:phoneUrl}),
                           guardianStore   = new JsonRest({target:guardianUrl}),
                           admissionStore  = new JsonRest({target:admissionUrl}),
                           visitStore      = new JsonRest({target:visitUrl});

                      reInitBottomPanels();

                        contactGrid = new DataGrid({
                                      store         : dataStore = ObjectStore
                                                              ({
                                                                 objectStore: contactStore
                                                              }),
                                      selectionMode : "single",
                                      rowSelector   : "20px",
                                      structure: [
                                                    {name       : "ID", 
                                                     field      : "id", 
                                                     width      : "50px",
                                                     hidden     : true,
                                                     cellStyles : "text-align:center;"
                                                    },

                                                    {name       : "PatID", 
                                                     field      : "pat_id", 
                                                     width      : "50px",
                                                     hidden     : true,
                                                     cellStyles : "text-align:center;"
                                                    },

                                                    {name       : "Edit", 
                                                     field      : "edit", 
                                                     width      : "50px",
                                                     hidden     : true,
                                                     cellStyles : "text-align:center;"
                                                    },

                                                    {name       : "Del", 
                                                     field      : "del", 
                                                     width      : "50px",
                                                     hidden     : true,
                                                     cellStyles : "text-align:center;"
                                                    },

                                                    {name       : "Type", 
                                                     field      : "address_type", 
                                                     width      : "50px",
                                                     cellStyles : "text-align:center;"
                                                    },

                                                    {name       : "Address", 
                                                     field      : "address", 
                                                     width      : "250px",
                                                     cellStyles : "text-align:center;"
                                                    },

                                                    {name       : "City", 
                                                     field      : "city", 
                                                     width      : "150px",
                                                     cellStyles : "text-align:center;"
                                                    },

                                                    {name       : "State", 
                                                     field      : "state", 
                                                     width      : "50px",
                                                     cellStyles : "text-align:center;"
                                                    },

                                                    {name       : "Country", 
                                                     field      : "country", 
                                                     width      : "100px",
                                                     cellStyles : "text-align:center;"
                                                    },

                                                    {name       : "Pincode", 
                                                     field      : "pincode", 
                                                     width      : "100px",
                                                     cellStyles : "text-align:center;"
                                                    }
                                      ],
                                      noDataMessage: "<span class='dojoxGridNoData'>No Contact Information in Store..</span>"
                                    }, 
                                    "contact_list"
                        )

                       function onPatientSubMenuRowClick(e, gridToUse, titleToUse){ 
                            var idx = e.rowIndex,
                                item = gridToUse.getItem(idx);
                            var contactid = gridToUse.store.getValue(item, "id");
                            var edit      = gridToUse.store.getValue(item, "edit");
                            var del       = gridToUse.store.getValue(item, "del");
                            gridToUse.selection.clear();
                            gridToUse.selection.setSelected(item, true);
                            xhr.get({
                                url  : edit,
                                load : function(html, idx){
                                var myDialog = dijit.byId("editPatientDialog");
                                if(myDialog == undefined || myDialog == null){
                                  myDialog = new dijit.Dialog({
                                                    title: titleToUse,
                                                    content: html,
                                                    style: "width: 500px; height:500px;"
                                                   }, "editPatientDialog");
                                  myDialog.startup();
                                }
                                else{
                                  myDialog.set('content', html);
                                  myDialog.set('title', titleToUse); 
                                }
                                myDialog.show();
                                }
                            });
                          return false; 
	                     };

                       function reInitBottomPanels(){
                              contactTable    = dijit.byId("contact_list")
                              phoneTable      = dijit.byId("phone_list")
                              guardianTable   = dijit.byId("guardian_list")
                              admissionTable  = dijit.byId("admission_list")
                              visitTable      = dijit.byId("visit_list")

                              if(contactTable){
                                contactTable.destroyRecursive();
                                domConstruct.place("<div id='contact_list'></div>",
                                                   "patientContactTab", 
                                                   'second'
                                                   );
                                
                              }
                              if(phoneTable){
                                phoneTable.destroyRecursive();
                                domConstruct.place("<div id='phone_list'></div>",
                                                   "patientPhoneTab", 
                                                   'second'
                                                   );
                                
                              }
                              if(guardianTable){
                                guardianTable.destroyRecursive();
                                domConstruct.place("<div id='guardian_list'></div>",
                                                   "patientGuardianTab", 
                                                   'second'
                                                   );
                                
                              }
                              if(admissionTable){
                                admissionTable.destroyRecursive();
                                domConstruct.place("<div id='admission_list'></div>",
                                                   "patientAdmissionTab", 
                                                   'second'
                                                   );
                                
                              }
                              if(visitTable){
                                visitTable.destroyRecursive();
                                domConstruct.place("<div id='visit_list'></div>",
                                                   "patientVisitTab", 
                                                   'second'
                                                   );
                              }
                              domStyle.set(dijit.byId("patientContextPane").domNode,{'display': 'display'});
                       }

                      function cleanUpAdmissionPane(){
                        var center_top_pane = dijit.byId('centerTopTabPane');
                  //      var admission_pane  = dijit.findWidgets("admissionHomeContentPane")
                        center_top_pane.selectChild(patientHomeContentPane);
                        dojo.forEach(admissionHomeContentPane, function(e){e.destroyRecursive(true)})
                        admissionHomeContentPane.domNode.innerHTML = 
                            "Please select an admission to display details here."
                      }

                      function cleanUpVisitPane(){
                        var center_top_pane = dijit.byId('centerTopTabPane');
                  //      var visit_pane  = dijit.findWidgets("centerBottomPaneTab3")
                        center_top_pane.selectChild(patientHomeContentPane);
                        dojo.forEach(visitHomeContentPane, function(e){e.destroyRecursive(true)})
                        visitHomeContentPane.domNode.innerHTML = 
                             "Please select a visit to display details here."
                      }


                      doPostDelCleanup = function (){
                        //TODO
                        /* This should update all the grid when a patient is deleted */
                        cleanUpAdmissionPane();
                        cleanUpVisitPane();
                        reInitBottomPanels();
                      }

                      contactGrid.onRowDblClick = function(e){ 
                  //  {% if perms.patient.change_patientcontact or perms.patient.delete_patientcontact %}
                                                      onPatientSubMenuRowClick(e,
                                                                               contactGrid, 
                                                                               "Edit Contact"
                                                                              );
                  //  {%endif%}
                                                      return false; 
                                                  };

                  phoneGrid = new DataGrid({
                                store         : dataStore = ObjectStore
                                                        ({
                                                           objectStore: phoneStore
                                                        }),
                                selectionMode : "single",
                                rowSelector   : "20px",
                                structure: [
                                            {name       : "ID", 
                                             field      : "id", 
                                             width      : "50px",
                                             hidden     : true,
                                             cellStyles : "text-align:center;"
                                            },

                                            {name       : "Edit", 
                                             field      : "edit", 
                                             width      : "50px",
                                             hidden     : true,
                                             cellStyles : "text-align:center;"
                                            },

                                            {name       : "Del", 
                                             field      : "del", 
                                             width      : "50px",
                                             hidden     : true,
                                             cellStyles : "text-align:center;"
                                            },

                                            {name       : "Type", 
                                             field      : "phone_type", 
                                             width      : "50px",
                                             cellStyles : "text-align:center;"
                                            },

                                            {name       : "ISD", 
                                             field      : "ISD_Code", 
                                             width      : "250px",
                                             cellStyles : "text-align:center;"
                                            },

                                            {name       : "STD", 
                                             field      : "STD_Code", 
                                             width      : "150px",
                                             cellStyles : "text-align:center;"
                                            },

                                            {name       : "Phone", 
                                             field      : "phone", 
                                             width      : "50px",
                                             cellStyles : "text-align:center;"
                                            },
                              ],
                              noDataMessage: "<span class='dojoxGridNoData'>No Phone Numbers in Store..</span>"
                          }, 
                          "phone_list"
                  )

                  phoneGrid.onRowDblClick = function(e){ 
        //                                  {% if perms.patient.change_patientphone or perms.patient.delete_patientphone %}
                                            onPatientSubMenuRowClick(e,phoneGrid, "Edit Phone");
                                            return false; 
        //                                  {% endif %}
                  };

                  guardianGrid = new DataGrid({
                                          store         : dataStore = ObjectStore
                                                                ({
                                                                   objectStore: guardianStore
                                                                }),
                                          selectionMode : "single",
                                          rowSelector   : "20px",
                                          structure: [
                                                      {name       : "ID", 
                                                        field      : "id", 
                                                        width      : "50px",
                                                        hidden     : true,
                                                        cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "Edit", 
                                                        field      : "edit", 
                                                        width      : "50px",
                                                        hidden     : true,
                                                        cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "Del", 
                                                        field      : "del", 
                                                        width      : "50px",
                                                        hidden     : true,
                                                        cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "Name", 
                                                        field      : "guardian_name", 
                                                        width      : "50px",
                                                        cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "Relation", 
                                                        field      : "relation_to_guardian", 
                                                        width      : "250px",
                                                        cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "Phone", 
                                                        field      : "guardian_phone", 
                                                        width      : "150px",
                                                        cellStyles : "text-align:center;"
                                                      },
                                          ],
                                          noDataMessage: "<span class='dojoxGridNoData'>No Guardian Information in Store..</span>"
                                        }, 
                                      "guardian_list"
              );

              guardianGrid.onRowDblClick = function(e){ 
          // {% if perms.patient.change_patientguardian or perms.patient.delete_patientguardian %}
                                              onPatientSubMenuRowClick(e,guardianGrid, "Edit Guardian");
                                              return false; 
          // {% endif %}
              };

                  admissionGrid = new DataGrid({
                                        store         : dataStore = ObjectStore
                                        ({
                                         objectStore: admissionStore
                                        }),
                                        selectionMode : "single",
                                        rowSelector   : "20px",
                                        clientSort    : false,
                                        headerStyle   : ['text-align:center;'],
                                        structure: [
                                                      {name       : "ID", 
                                                        field      : "id", 
                                                        width      : "50px",
                                                        hidden     : true,
                                                        cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "Home", 
                                                        field      : "home", 
                                                        width      : "50px",
                                                        hidden     : true,
                                                        cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "Edit", 
                                                        field      : "edit", 
                                                        width      : "50px",
                                                        hidden     : true,
                                                        cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "Del", 
                                                        field      : "del", 
                                                        width      : "50px",
                                                        hidden     : true,
                                                        cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "DOA", 
                                                        field      : "date_of_admission", 
                                                        width      : "50px",
                                                        cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "TOA", 
                                                        field      : "time_of_admission", 
                                                        width      : "50px",
                                                        cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "Surgeon", 
                                                        field      : "admitting_surgeon", 
                                                        width      : "250px",
                                                        cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "Status", 
                                                        field      : "admission_closed", 
                                                        width      : "150px",
                                                        cellStyles : "text-align:center;",
                                                        formatter : function(admission_closed){
                                                                          if(admission_closed == true){
                                                                              return '<img src="{{STATIC_URL}}images/flag_green.png" '+
                                                                              'alt="Discharged" class="small_img">'; 
                                                                          }
                                                                          else if(admission_closed == false){
                                                                              return '<img '+
                                                                              'src="{{STATIC_URL}}images/flag_green.png"'+
                                                                              'alt="Active" class="small_img">'; 
                                                                          }
                                                                          else{
                                                                              return "Others"
                                                                          }
                                                                    } 
                                                      },

                                                      {name       : "Room", 
                                                      field      : "room_or_ward", 
                                                      width      : "50px",
                                                      cellStyles : "text-align:center;"
                                                      },

                                                      {name       : "Hospital", 
                                                      field      : "hospital", 
                                                      width      : "100px",
                                                      cellStyles : "text-align:center;"
                                                      },
                                        ],
                                        noDataMessage: "<span class='dojoxGridNoData'>No Admission Information in Store..</span>",
                                        }, 
                                        "admission_list"
    )

    admissionGrid.onRowDblClick = function(e){
//  {% if perms.admission.change_admissiondetail or perms.admission.delete_admissiondetail %}
                                    onPatientSubMenuRowClick(e,
                                                             admissionGrid, 
                                                             "Edit Admission"
                                                            );
                                    return false; 
// {% endif %}
   };

    admissionGrid.onRowClick   = function(e){ 
//                                {% if perms.admission %}
                                  var topContentPane = registry.byId('centerTopTabPane');
                                  var newTabPane     = registry.byId("admissionHomeContentPane");
                                  console.log(newTabPane)
                                  var item           = admissionGrid.getItem(e.rowIndex);
                                  var homeUrl        = admissionGrid.store.getValue(item,'home')
                                  console.log(homeUrl)
                                  xhr.get({
                                       url    : homeUrl,
                                       load   : function(content){
                                                  newTabPane.set('content', content)
                                                  topContentPane.selectChild(newTabPane);
                                                }
                                  });
                                  return false; 
//                                {% endif %}
                                 };



    visitGrid = new DataGrid({
                              store         : dataStore = ObjectStore
                                                      ({
                                                         objectStore: visitStore
                                                      }),
                              selectionMode : "single",
                              rowSelector   : "20px",
                              structure: [
                                          {name       : "ID", 
                                           field      : "id", 
                                           width      : "50px",
                                           hidden     : true,
                                           cellStyles : "text-align:center;"
                                          },

                                          {name       : "Edit", 
                                           field      : "edit", 
                                           width      : "50px",
                                           hidden     : true,
                                           cellStyles : "text-align:center;"
                                          },

                                          {name       : "Del", 
                                           field      : "del", 
                                           width      : "50px",
                                           hidden     : true,
                                           cellStyles : "text-align:center;"
                                          },

                                          {name       : "DOV", 
                                           field      : "visit_date", 
                                           width      : "50px",
                                           cellStyles : "text-align:center;"
                                          },

                                          {name       : "Surgeon", 
                                           field      : "op_surgeon", 
                                           width      : "250px",
                                           cellStyles : "text-align:center;"
                                          },

                                          {name       : "Nature", 
                                           field      : "consult_nature", 
                                           width      : "150px",
                                           cellStyles : "text-align:center;"
                                          },

                                          {name       : "Status", 
                                           field      : "is_active", 
                                           width      : "50px",
                                           cellStyles : "text-align:center;"
                                          },

                                          {name       : "Remarks", 
                                           field      : "remarks", 
                                           width      : "100px",
                                           cellStyles : "text-align:center;"
                                          },
                              ],
                              noDataMessage: "<span class='dojoxGridNoData'>No Visit Information in Store..</span>"
                              }, 
                              "visit_list"
    );

    visitGrid.onRowDblClick = function(e){ 
//{% if perms.visit.change_visitdetail or perms.visit.delete_visitdetail %}
                                    onPatientSubMenuRowClick(e,visitGrid, "Edit Visit");
//{% endif %}
                                   return false; 
    };

    contactGrid.startup();
    phoneGrid.startup();
    guardianGrid.startup();
    admissionGrid.startup();
    visitGrid.startup();
    return false; 
 };

    grid.onRowDblClick = function(e){ 
                        //{% if perms.patient.change_patientdetail or perms.patient.delete_patientdetail %}
                          var idx = e.rowIndex,
                              item = this.getItem(idx);
                          var patid = this.store.getValue(item, "id");
                          var edit  = this.store.getValue(item, "edit");
                          var del   = this.store.getValue(item, "del");
                          var visitadd      = this.store.getValue(item, "visitadd");
                          var admissionadd  = this.store.getValue(item, "admissionadd");
                          if( e.cell.field == 'home'){
                              e.cell.loadTab();
                          }
                          else{
                              grid.selection.clear();
                              grid.selection.setSelected(item, true);
                              xhr.get({
                                      url  : edit,
                                      load : function(html, idx){
                                                var myDialog = dijit.byId("editPatientDialog");
                                                if(myDialog == undefined || myDialog == null){
                                                  myDialog = new dijit.Dialog({
                                                                      title: "Edit Patient",
                                                                      content: html,
                                                                      style: "width: 500px; height:500px;"
                                                                      }, 
                                                                      "editPatientDialog"
                                                  );
                                                  myDialog.startup();
                                                }
                                                else{
                                                  myDialog.set('content', html);
                                                  myDialog.set('title', "Edit Patient"); 
                                                }
                                                myDialog.show();
                                      }
                            })
                          }
                    //{% endif %}
                      return false; 
    };

//{% if perms.patient.add_patientdetail %}
    var addPatientButton =  new dijit.form.Button({
                                              label: "Register New Patient",
                                              iconClass:"dijitIconNewTask",
                                              onClick: function(){
                                                                require(["dojo/_base/xhr",
                                                                        "dijit/registry", 
                                                                        "dijit/Dialog"
                                                                ], 
                                                                function(xhr, registry, Dialog){
                                                                      var myDialog = dijit.byId("editPatientDialog");
                                                                      xhr.get({
                                                                              url: "{%url patient_new_add %}",
                                                                              load: function(html){
                                                                                   myDialog.set('content', html);
                                                                                   myDialog.set('title', "Enroll New Patient to the Clinic - {{ user.clinic_name }}");
                                                                                   myDialog.show();
                                                                              }
                                                                      });
                                                                });
                                              }
                                            }, 
                                            "addPatientButton"
    );
//{% endif %}

//{% if perms.patient.add_patientcontact %}
    var addContactButton =  new dijit.form.Button({
                                                  label: "Add Contact",
                                                  iconClass: "dijitIconNewTask",
                                                  onClick: function(){
                                                                require(["dojo/_base/xhr", "dojo/_base/array"],
                                                                function(xhr, array){
                                                                    var gridRow    = grid.selection.getSelected();
                                                                    var id         = grid.store.getValue(gridRow[0], 'id');
                                                                    xhr.get({
                                                                            url: "{%url contact_json %}"+"?patient_id="+ id +"&action=add",
                                                                            load: function(html){
                                                                                          var myDialog = dijit.byId("editPatientDialog");
                                                                                          myDialog.set('content', html);
                                                                                          myDialog.set('title', "Add Postal Address Information");
                                                                                          myDialog.show();
                                                                                  }
                                                                     });
                                                                });
                                                 }
                                              }, 
                                              "addContactButton"
    );
//{% endif %}

//{% if perms.patient.add_patientphone %}
	  var addPhoneButton =  new dijit.form.Button({
                                          label: "Add Phone",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{%url phone_json %}"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                   var myDialog = dijit.byId("editPatientDialog");
                                                                   myDialog.set('content', html);
                                                                   myDialog.set('title', "Add Phone Numbers");
                                                                   myDialog.show();
                                                             }
                                                   });
                                                 })
                                          }
                         }, 
                         "addPhoneButton"
  );
//{% endif %}

//{%if perms.patient.add_patientguardian %}
    var addGuardianButton =  new dijit.form.Button({
                                          label: "Add Guardian",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{%url guardian_json %}"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                               var myDialog = dijit.byId("editPatientDialog");
                                                               myDialog.set('content', html);
                                                               myDialog.set('title', "Add Guardian Information ");
                                                               myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addGuardianButton");
//{% endif %}

//{% if perms.admission.add_admissiondetail %}
	  var addAdmissionButton =  new dijit.form.Button({
                                          label: "New Admission",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{%url admission_json %}"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', "Record New Admission to the Clinic - {{ user.clinic_name }}");
                                                                 myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addAdmissionButton");
//{% endif %}

//{% if perms.visit.add_visitdetail %}
	  var addVisitButton =  new dijit.form.Button({
                                          label: "New Visit",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "{%url visit_json %}"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', " Record New Out Patient Visit to the Clinic - {{ user.clinic_name }}");
                                                                 myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addVisitButton");
//{% endif %}

//{% if perms.patient %}
	  var addDemographicsButton =  new dijit.form.Button({
                                          label: "Add Demographics",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "/AuShadha/"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', "Record Demographics Information");
                                                                  myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addDemographicsButton");
//{% endif %}


//{% if perms.patient %}
	  var addAllergyButton =  new dijit.form.Button({
                                          label: "New Allergy",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id         = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "/AuShadha/"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', "Record New Allergy Details");
                                                                 myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addAllergyButton");
//{% endif %}

//{% if perms.patient %}
	  var addPatientImmunizationButton =  new dijit.form.Button({
                                          label: "Add Immunization",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "/AuShadha/"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', "Record New Immunization Details");
                                                                 myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addPatientImmunizationButton");
//{% endif %}


//{% if perms.patient %}
	  var addPatientMediaButton =  new dijit.form.Button({
                                          label: "Add Patient Media",
                                          iconClass: "dijitIconNewTask",
                                          onClick: function(){
                                                 require(
                                                  ["dojo/_base/xhr", "dojo/_base/array"],
                                                  function(xhr, array){
                                                    var gridRow    = grid.selection.getSelected();
                                                    var id = grid.store.getValue(gridRow[0], 'id');
                                                    xhr.get({
                                                      url: "/AuShadha/"+"?patient_id="+ id +"&action=add",
                                                      load: function(html){
                                                                 var myDialog = dijit.byId("editPatientDialog");
                                                                 myDialog.set('content', html);
                                                                 myDialog.set('title', "Add Patient Media");
                                                                 myDialog.show();
                                                            }
                                                   });
                                                 })
                                          }
                         }, "addPatientMediaButton");
//{% endif %}



// {% endif %} 

  genericFormBehaviour();

  var patientIdStore = new JsonRest({
            target     : "{%url patient_id_autocompleter %}",
            idProperty : 'patient_id'
        });

    var patientHospitalIdStore = new JsonRest({
            target     : "{%url patient_hospital_id_autocompleter  %}",
            idProperty : 'patient_id'
        });

    var patientNameStore = new JsonRest({
            target     : "{%url patient_name_autocompleter %}",
            idProperty : 'patient_id'
        });


    var patientHospitalIdSelect = new dijit.form.FilteringSelect({
        label        : "Search Patient ID: ",
        name         : "patientHospitalIdAutoCompleter",
        store        : patientHospitalIdStore,
        autoComplete : false,
        required     : true,
        placeHolder  : "Search Patient ID.",
        hasDownArrow : true,
        style        : "width: 175px; margin-left: 20px;",
        searchAttr   : "patient_hospital_id",
        labelAttr    : "name",
        onChange     : function(patient_hospital_id){
                        console.log("You chose " + this.item.patient_hospital_id)
                        console.log("You chose Patient: " + this.item.patient_name)
                        if(this.item == false){
                          dojo.attr( dojo.byId("patientSearchFormSubmitBtn"),
                                     'disabled',
                                     'disabled'
                          )
                        }
                        if(this.item){
                          dojo.attr( dojo.byId("patientSearchFormSubmitBtn"),'disabled','')
                          console.log(patientHospitalIdStore)
                          console.log(this.item.patient_hospital_id)
                          var queryItem = patientHospitalIdStore.
                                               query({"patient_hospital_id": 
                                                       this.item.patient_hospital_id}
                                               )
                          var get_name    = this.item.patient_name+""
                          var patNameItem = patientNameStore.
                                               query({"patient_name" : this.item.patient_name ,
                                                      "patient_id"   : this.item.patient_id 
                                               });
                          dijit.byId("patientNameSelection").
                                set('displayedValue', this.item.patient_name);
                          var patient_id = this.item.patient_id;
                          var searchedPatientId = myStore.query({'patient_id': patient_id});
                          grid.filter({id: patient_id }, true);
                          console.log(searchedPatientId);
//                            alert(searchedPatientId.results )
//                            var myStorePatient = grid.store.fetchItemByIdentity({"patient_id":patient_id})
//                            console.log(myStorePatient)
                        }
                      }
    },
   "patientHospitalIdSelection"
   );

  patientHospitalIdSelect.startup();


  var patientNameSelect = new dijit.form.FilteringSelect({
      label        : "Search Patient Name ",
      name         : "patientNameAutoCompleter",
      store        : patientNameStore,
      autoComplete : false,
      required     : true,
      placeHolder  : "Search Patient Name",
      hasDownArrow : true,
      labelAttr    : "patient_name",
      style        : "width: 175px; margin-left: 20px;",
      searchAttr   : "patient_name",
      onChange     : function(patient_name){
//                            alert("You chose " + this.item.patient_hospital_id)
                      if(this.item){
//                              alert(this.item.patient_id)
                        var queryItem = patientHospitalIdStore.
                                         query({ 'patient_hospital_id':
                                                 this.item.patient_hospital_id
                                         });

                        dijit.byId("patientHospitalIdSelection").
                         set('displayedValue', this.item.patient_hospital_id);
/*
                        dijit.byId("patientIdSelection").
                         set('displayedValue', queryItem.patient_hospital_id);
*/
                      }
                    }
  },
  "patientNameSelection"
  );
  
  patientNameSelect.startup();

// Setting Focus on Page Load;;
//    dijit.byId('filterPatGridTextBox').focus();

});


