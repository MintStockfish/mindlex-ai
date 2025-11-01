const script = `
(function() {
	try {
		var theme = localStorage.getItem('theme');
		if (theme) {
			document.documentElement.setAttribute('class', theme);
			return;
		}
		var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
		var systemTheme = darkQuery.matches ? 'dark':'light';
		document.documentElement.setAttribute('class', systemTheme);
	} catch (e) {}
})();
`;

export const ThemeScript = () => {
    return <script dangerouslySetInnerHTML={{ __html: script }} />;
};
