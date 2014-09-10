require 'kdtree'
@kd = File.open("treefile") { |f| Kdtree.new(f) }
@kd.nearestk(45.508519,-73.571836,255)

