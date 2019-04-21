import os

import firebase_admin
from firebase_admin import credentials
import pyrebase

class Firebase:
    class __Firebase:
        def __init__(self):
            self.user = None
            self.cred = credentials.Certificate(os.path.join(os.path.dirname(__file__),"ttluis-57336-firebase-adminsdk-y9jqk-ce50856c8d.json"))
            firebase_admin.initialize_app(self.cred)
            config = {
                "apiKey": "AIzaSyBTGtRyCgEKwi2Cw5N9kvghNSREHuJSfKk",
                "authDomain": "ttluis-57336.firebaseapp.com",
                "databaseURL": "https://ttluis-57336.firebaseio.com",
                "storageBucket": "gs://ttluis-57336.appspot.com"
            }
            self.reference = pyrebase.initialize_app(config)

        def __str__(self):
            return repr(self)

        def authuser(self,email,password):
            auth = self.reference.auth()
            try:
                self.user = auth.sign_in_with_email_and_password(email,password)
                return self.user
            except Exception as e:
                return None

        def resetPass(self,email):
            auth = self.reference.auth()
            try:
                return auth.send_password_reset_email(email)
            except Exception as e:
                return None

        def createuser(self,email,password):
            auth = self.reference.auth()
            try:
                return auth.create_user_with_email_and_password(email, password)
            except Exception as e:
                return None

        def deleteuser(self,token):
            auth = self.reference.auth()
            try:
                return auth.delete_user_account(token)
            except Exception as e:
                return None
    instance = None

    def __init__(self):
        if not Firebase.instance:
            Firebase.instance = Firebase.__Firebase()

    def __getattr__(self, name):
        return getattr(self.instance, name)
