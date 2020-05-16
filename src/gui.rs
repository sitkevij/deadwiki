#[cfg(feature = "gui")]
use web_view;

use {
    crate::web,
    std::{io, thread},
};

type Result<T> = std::result::Result<T, io::Error>;

/// Start a web server and launch the GUI.
pub fn run(host: &str, port: usize, wiki_root: &str) -> Result<()> {
    let host = host.to_string();
    let url = format!("http://{}:{}", host, port);

    let mut wv = web_view::builder()
        .title("deadwiki")
        .content(web_view::Content::Url(&url))
        .size(1024, 768)
        .resizable(true)
        .debug(true)
        .user_data(())
        .invoke_handler(|_webview, _arg| Ok(()))
        .build()
        .unwrap();

    if wiki_root.is_empty() {
        if let Ok(Some(wiki_root)) = wv.dialog().choose_directory("Wiki Root", "") {
            crate::set_wiki_root(&wiki_root.to_str().unwrap_or("."))?;
            wv.eval(&format!("location.href = \"{}\";", url)).unwrap();
        } else {
            return Err(io::Error::new(
                io::ErrorKind::Other,
                "No Wiki Root Selected.",
            ));
        }
    }

    thread::spawn(move || web::server(&host, port));

    wv.run().unwrap();
    Ok(())
}