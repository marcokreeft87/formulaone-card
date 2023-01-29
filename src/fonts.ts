
export const load_f1_font = () => {
    // Load the F1 font using the CSS Font Loading API
    const font = new FontFace("F1Bold", "url(https://www.formula1.com/etc/designs/fom-website/fonts/F1Bold/Formula1-Bold.woff)");
    document.fonts.add(font);
    font.load();
}
