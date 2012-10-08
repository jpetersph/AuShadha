
###########################################################################################
# PROJECT: Base AuShadha Model Deriving from models.Model
#          
# Author : Dr. Easwar T R
# Date   : 28-08-2012
# Licence: GNU GPL V3. Please see AuShadha/LICENSE.txt
###########################################################################################

from django.db	              import models
from django.forms	      import ModelForm
from django.core.exceptions   import ValidationError
from django 		      import forms


def generic_url_maker(instance,action,id, root_object = False):
  """
    Returns the URL Pattern for any AuShadha Object
    Following the naming conventions
    instance   : an instance of a Django Model
    action     : action that URL will commit : add/edit/delete/list/
    root_object: for the list option is root_object is False, instance id will be appended to URL else no id 
                 will be appended. 
                 Eg:: to list all patients, under a clinic once a queryset is done
                 the id will be that of the clinic. But for the root object clinic since there is no db_relationship
                 that fetches a list of clinics, all clinics are fetched and listed.
  """
  #FIXME:: may be better to rely on django.contrib.contenttypes.ContentType to do a similar thing rather than using _meta  
  from AuShadha.settings import APP_ROOT_URL
  if not root_object:
    url = unicode(APP_ROOT_URL) + unicode(instance._meta.app_label)+ "/" + unicode(action) +"/" + unicode(id) +"/"
  if root_object:
    url = unicode(APP_ROOT_URL) + unicode(instance._meta.app_label)+ "/" + unicode(action) +"/"
  return url



class AuShadhaBaseModel(models.Model):

  '''
    base AuShadha Model From which all AuShadha Models Derive. 
  '''

  get_edit_url = models.CharField(max_length = 150, default = "", editable = False)
  get_del_url  = models.CharField(max_length = 150, default = "", editable = False)


  def __init__(self, *args, **kwargs):
    super(self, AuShadhaBaseModel).__init__(*args, **kwargs)

  def save(self, *args, **kwargs):
    super(self, AuShadhaBaseModel).save(*args, **kwargs)
    id  = self.id
    self._set_urls(id)

  def _set_urls(self, id):
    self.get_edit_url = generic_url_maker(self, "edit", id)
    self.get_del_url  = generic_url_maker(self, "del", id)
    super(self, AuShadhaBaseModel).save(*args, **kwargs)
