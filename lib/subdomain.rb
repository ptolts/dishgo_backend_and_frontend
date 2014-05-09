class Subdomain
  def self.matches?(request)
    if request.host == 'dishgo.io' and ['www','','dev'].include?(request.subdomain)
      return false
    else
      true
    end
  end
end