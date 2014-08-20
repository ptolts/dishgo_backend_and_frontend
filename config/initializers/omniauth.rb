Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, "OIaEFYGvvfvoqcoakQ5OyePzJ", "RHgKIG8eIptBoZMfXDxWTxucLmbBgYFUHuHVDznseDLDnu0pNs" 
  if Rails.env.development?
  	provider :facebook, "886480311381787", "414189742670e53a5b0409d5b438a1cc", display: 'popup'
  else
  	provider :facebook, "886479778048507", "7595a0c846885173a20a83aefd5def0a", display: 'popup'
  end
end
