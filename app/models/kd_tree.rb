# #encoding: UTF-8

# class KdTree
#   def build
#     points = []
#     Restaurant.only(:id,:lat,:lon).each do |restaurant|
#       points << [restaurant.lat, restaurant.lon,  restaurant.id] # New York id=3
#     end
#     kd = Kdtree.new(points)
#     File.open("treefile", "w") { |f| kd.persist(f) }
#   end

#   def find lat, lon
#     if load
#       return @kd.nearestk(lat,lon,255)
#     else
#       return false
#     end
#   end

#   def load
#     @kd = File.open("treefile") { |f| Kdtree.new(f) }
#   end
# end
