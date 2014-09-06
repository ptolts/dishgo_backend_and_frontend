module NetworkHelper
	def stars rating
        full = "<i class=\"fa fa-star\"></i>"
        half = "<i class=\"fa fa-star-half-o\"></i>"
        left_full = "<i class=\"fa fa-star left_over fa-flip-horizontal\"></i>"
        left_half = "<i class=\"fa fa-star-half-o left_over fa-flip-horizontal\"></i>"        
        result = ""
        left_over = 5 - rating
        while rating > 0
            if rating >= 1
                rating -= 1
                result = result + full
                next
            end
            if rating >= 0.5
                rating = rating - 0.5
                result = result + half
                next
            end
        end
        while left_over > 0
            if left_over >= 1
                left_over -= 1
                result = result + left_full
                next
            end
            if left_over >= 0.5
                left_over = left_over - 0.5
                result = result + left_half
                next
            end
        end        
        return result
	end

    def first_non_empty value
        text = value.select{|r,e| !e.blank?}
        return "" unless text
        text = text.first[1]
        return text
    end

    def first_non_empty_truncated value
        text = value.select{|r,e| !e.blank?}
        return "" unless text.first
        text = text.first[1]
        truncated_text = text[0..88]
        truncated_text = truncated_text + "..." if text.length > 88
        return truncated_text
    end    

end