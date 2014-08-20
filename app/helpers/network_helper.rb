module NetworkHelper
	def stars rating
        full = "<i class=\"fa fa-star\"></i>"
        half = "<i class=\"fa fa-star-half-o\"></i>"
        result = ""
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
        return result
	end
end