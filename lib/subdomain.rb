class Subdomain
  def self.matches?(request)
    if ((request.host == 'dishgo.io' or request.host == 'www.dishgo.io') and ['www','','dev'].include?(request.subdomain)) or request.host =~ /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/
      return false
    else
      true
    end
  end
end