class Subdomain
  def self.matches?(request)
    if (request.host =~  /dishgo\.(io|ca)/i and ['www','','dev'].include?(request.subdomain.to_s.downcase)) or request.host =~ /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/ or request.host == 'localhost'
      return false
    else
      true
    end
  end
end