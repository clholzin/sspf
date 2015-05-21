window.polyglot = new Polyglot();
_.bindAll(polyglot, "t");
window.t = polyglot.t;
polyglot.extend({
    "generic.show": "Show",
    "generic.edit": "Edit",
    "generic.save": "Save",
    "generic.delete": "Delete",
    "generic.remove": "Remove",
    "generic.changedOnServer": "This model has changed on the server, and has been updated with the latest data from the server and your changes have been reapplied.",
    "generic.confirmationMessage": "Are you sure?",
    "generic.unprocessedError": "An unprocessed error happened. Please try again!",
    "menu.Contacts": "Contacts",
    "menu.About": "About",
    "about.title": "About this application",
    "about.message.design": "This application was designed to accompany you during your learning.",
    "about.message.closing": "Hopefully, it has served you well !",
    "acquaintance.modelName": "Acquaintance",
    "acquaintance.addConfirmation": "Add %{firstName} as an acquaintance?",
    "contact.attributes.firstName": "First Name",
    "contact.attributes.lastName": "Last Name",
    "contact.attributes.phoneNumber": "Phone number",
    "contact.attributes.acquaintances": "Acquaintances",
    "contact.attributes.strangers": "Strangers",
    "contact.newContact": "New contact",
    "contact.editContact": "Edit this contact",
    "contact.filterContacts": "Filter contacts",
    "contact.noneToDisplay": "No contacts to display.",
    "contact.missing": "This contact doesn't exist !",
    "loading.title": "Loading Data",
    "loading.message": "Please wait, data is loading."
});