if ENV['RAILS_ENV'].to_s.eql?('development')
	Stripe.api_key = "sk_test_Xnlkn6YzWIkicgNu2OFHTq5u"
	STRIPE_PUBLIC_KEY = "pk_test_7ctTZFdEpfDZ5sxVarqyeQwL"
else
	Stripe.api_key = "sk_live_s2demBEHXW8df6w5nQdN9Qs5"
	STRIPE_PUBLIC_KEY = "pk_live_Nk71kIgElL3rm2lKKT970kPy"
end

