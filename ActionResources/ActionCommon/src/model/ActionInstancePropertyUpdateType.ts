export enum ActionInstancePropertyUpdateType {
    // Replace the old property value with a new one
    Update = "Update",

    // Add a whole new property
    Add = "Add",

    // Delete a whole property
    Delete = "Delete",

    // Replace an entry in the property value (Array type) with a new one
    Replace = "Replace",

    // Add entries in the property value (Array type)
    Append = "Append",

    // Remove entries from the property value (Array type)
    Remove = "Remove",
}