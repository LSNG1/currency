const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const resultDisplay = document.getElementById('result');

const API_KEY = '30eaadc41bd6f0466c288bdf';
const API_URL = 'https://v6.exchangerate-api.com/v6/' + API_KEY;

async function fetchCurrencies() {
	try {
		const res = await fetch(`${API_URL}/latest/USD`);
		const data = await res.json();

		if (data.result !== 'success') {
			resultDisplay.textContent = "Impossible de charger les devises. Réessayez plus tard.";
			return;
		}

		const currencies = Object.keys(data.conversion_rates);
		currencies.forEach(curr => {
			fromCurrency.innerHTML += `<option value="${curr}">${curr}</option>`;
			toCurrency.innerHTML += `<option value="${curr}">${curr}</option>`;
		});
		fromCurrency.value = 'EUR';
		toCurrency.value = 'USD';
	} catch (e) {
		resultDisplay.textContent = "Erreur réseau. Vérifiez votre connexion.";
	}
}

async function convert() {
	const amount = parseFloat(amountInput.value);
	if (isNaN(amount) || amount <= 0) {
		resultDisplay.textContent = "Veuillez entrer un montant valide supérieur à 0.";
		return;
	}

	const from = fromCurrency.value;
	const to = toCurrency.value;

	try {
		const res = await fetch(`${API_URL}/pair/${from}/${to}/${amount}`);
		const data = await res.json();

		if (data.result === 'success') {
			resultDisplay.textContent = `${amount} ${from} = ${data.conversion_result.toFixed(2)} ${to}`;
		} else {
			resultDisplay.textContent = "Conversion impossible. Devise inconnue.";
		}
	} catch (e) {
		resultDisplay.textContent = "Erreur de conversion. Réessayez plus tard.";
	}
}

[fromCurrency, toCurrency, amountInput].forEach(el => el.addEventListener('input', convert));

fetchCurrencies();
