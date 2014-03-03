class Subdomain
  def self.matches?(request)
    case request.subdomain
    when 'www', '', nil, 'dev'
      false
    else
      true
    end
  end
end