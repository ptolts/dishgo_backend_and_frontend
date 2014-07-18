class Letsdishgo
  def self.matches?(request)
    if request.host =~ /letsdishgo\.com/i
		return true
    else
    	false
    end
  end
end