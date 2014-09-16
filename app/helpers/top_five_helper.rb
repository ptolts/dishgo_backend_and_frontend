module TopFiveHelper

    def first_non_empty value
        text = value.select{|r,e| !e.blank?}
        return "" if text.empty?
        text = text.first[1]
        return text
    end
  

end