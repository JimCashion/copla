//  Server Config stuff

exports.db_physical_location = "./db/persisted";  //  relative location of physical database
exports.db_journal_location = "./db/journal";  //  relative location of journal
exports.be_location = "./BEs";  //  relative location of business entities
exports.db_location = "./db";  //  relative location of database module
exports.listen_port = 8081;	  //  port to losten on
exports.journal_delimiter = "|";  //  journal delimiter
exports.journal_newline = "\n";  //  journal new line character sequence
exports.auto_persist_interval = 3600000;  //  auto persist interval in miliseconds
