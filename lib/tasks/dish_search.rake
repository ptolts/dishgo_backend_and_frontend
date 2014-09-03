task :dish_search => :environment do
	Dish.each {|e| e.set_search_terms }
end